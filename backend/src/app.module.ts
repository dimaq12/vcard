import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { VCard } from './vcard/vcard.entity';
import { Session } from './session/session.entity';
import { UserModule } from './user/user.module';
import { VCardModule } from './vcard/vcard.module';
import { SessionModule } from './session/session.module';
import * as path from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DATABASE_PATH || path.resolve(__dirname, '..', 'db.sqlite'),
      entities: [User, Session, VCard],
      synchronize: true, 
    }),
    UserModule,
    VCardModule,
    SessionModule,
  ],
  providers: [], 
})
export class AppModule {}
