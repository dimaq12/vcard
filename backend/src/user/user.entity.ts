import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Session } from '../session/session.entity';
import { VCard } from '../vcard/vcard.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Session, { cascade: true, nullable: true })
  @JoinColumn({ name: 'sessionId' })
  session?: Session;

  @Column({ nullable: true })
  sessionId?: string;

  @OneToOne(() => VCard, (vcard) => vcard.user, { cascade: true })
  vcard?: VCard;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  website?: string;

  @Column({ nullable: true })
  notes?: string;

  @Column({ nullable: true })
  photo?: string;
}
