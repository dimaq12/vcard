import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from './session.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private sessionRepo: Repository<Session>,
  ) {}

  async getOrCreate(sessionId?: string): Promise<Session> {
    if (sessionId) {
      const existing = await this.sessionRepo.findOne({ where: { id: sessionId } });
      if (existing) return existing;
    }

    const session = this.sessionRepo.create({ id: uuidv4() });
    return await this.sessionRepo.save(session);
  }
}
