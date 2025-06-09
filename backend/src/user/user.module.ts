import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { VCard } from '../vcard/vcard.entity';
import { Session } from '../session/session.entity';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, VCard, Session]),
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
