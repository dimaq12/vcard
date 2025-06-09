import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class VCard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  hash: string;

  @OneToOne(() => User, (user) => user.vcard, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;
}
