// src/vcard/vcard.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VCard } from './vcard.entity';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';

@Injectable()
export class VCardService {
  constructor(
    @InjectRepository(VCard)
    private readonly vcardRepo: Repository<VCard>,
    private readonly userService: UserService,
  ) {}

  async getCurrentUserAndVCard(sessionId: string): Promise<{ user: any; vcard: VCard }> {
    const user = await this.userService.findBySession(sessionId);
    if (!user) throw new NotFoundException('User not found');

    const vcard = await this.vcardRepo.findOne({
      where: { userId: user.id },
    });
    if (!vcard) throw new NotFoundException('VCard not found');

    return { user, vcard };
  }

  async createOrGet(createUserDto: CreateUserDto, sessionId: string): Promise<{ user: any; vcard: VCard }> {
    const user = await this.userService.getOrCreate(createUserDto, sessionId);

    let vcard = await this.vcardRepo.findOne({ where: { userId: user.id } });
    if (!vcard) {
      throw new NotFoundException('VCard not created with user');
    }

    return { user, vcard };
  }

  async updateCurrent(sessionId: string, dto: UpdateUserDto): Promise<{ user: any; vcard: VCard }> {
    const user = await this.userService.findBySession(sessionId);
    if (!user) throw new NotFoundException('User not found');

    await this.userService.update(user.id, dto);
    const updatedUser = await this.userService.findById(user.id);

    const vcard = await this.vcardRepo.findOne({ where: { userId: user.id } });
    if (!vcard) throw new NotFoundException('VCard not found');

    return { user: updatedUser, vcard };
  }

  async deleteCurrent(sessionId: string): Promise<void> {
    const user = await this.userService.findBySession(sessionId);
    if (!user) throw new NotFoundException('User not found');

    await this.userService.delete(user.id);
  }

  async findByHash(hash: string): Promise<{ vcard: VCard; user: any }> {
    const vcard = await this.vcardRepo.findOne({
      where: { hash },
      relations: ['user'],
    });
    if (!vcard || !vcard.user) throw new NotFoundException('Card or user not found');

    return { vcard, user: vcard.user };
  }
}
