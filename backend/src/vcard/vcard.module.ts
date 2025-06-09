import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VCard } from './vcard.entity';
import { VCardService } from './vcard.service';
import { VCardController } from './vcard.controller';
import { User } from '../user/user.entity';
import { UserModule } from '../user/user.module';
import { SessionModule } from '../session/session.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([VCard, User]),
    UserModule,
    SessionModule, 
  ],
  controllers: [VCardController],
  providers: [VCardService],
  exports: [VCardService],
})
export class VCardModule {}
