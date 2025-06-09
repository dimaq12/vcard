import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { VCard } from '../vcard/vcard.entity';
import { Session } from '../session/session.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { generateHash } from '../utils/generate-hash';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(VCard)
    private readonly vcardRepo: Repository<VCard>,

    @InjectRepository(Session)
    private readonly sessionRepo: Repository<Session>,
  ) {}

  async getOrCreate(data: Omit<User, 'id' | 'sessionId'>, sessionId: string): Promise<User> {
    let existing = await this.userRepo.findOne({
      where: { sessionId },
      relations: ['vcard'],
    });

    if (existing) return existing;

    let session = await this.sessionRepo.findOne({ where: { id: sessionId } });
    if (!session) {
      session = this.sessionRepo.create({ id: sessionId });
      await this.sessionRepo.save(session);
    }

    const user = this.userRepo.create({ ...data, sessionId, session });
    const savedUser = await this.userRepo.save(user);

    const vcard = this.vcardRepo.create({
      user: savedUser,
      hash: generateHash(),
    });
    await this.vcardRepo.save(vcard);

    return savedUser;
  }

  findById(id: string): Promise<User | null> {
    return this.userRepo.findOne({
      where: { id },
      relations: ['vcard'],
    });
  }

  findBySession(sessionId: string): Promise<User | null> {
    return this.userRepo.findOne({
      where: { sessionId },
      relations: ['vcard'],
    });
  }

  findAllBySession(sessionId: string): Promise<User[]> {
    return this.userRepo.find({
      where: { sessionId },
      relations: ['vcard'],
    });
  }

  async update(id: string, data: Partial<UpdateUserDto>): Promise<void> {
    await this.userRepo.update(id, data);
  }

  async delete(id: string): Promise<void> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['session', 'vcard'],
    });
    if (!user) return;

    if (user.vcard) {
      await this.vcardRepo.delete({ user: { id: user.id } });
    }

    const sessionId = user.sessionId;
    await this.userRepo.delete(id);

    const others = await this.userRepo.count({ where: { sessionId } });
    if (others === 0) {
      await this.sessionRepo.delete(sessionId);
    }
  }

  async validateOwnership(userId: string, sessionId: string): Promise<User> {
    const user = await this.findById(userId);
    if (!user || user.sessionId !== sessionId) {
      throw new ForbiddenException('Access denied');
    }
    return user;
  }
}
