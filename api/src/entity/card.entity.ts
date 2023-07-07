import {
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Comment } from './comment.entity';

enum CardState {
  to_do = 'to_do',
  in_progress = 'in_progress',
  done = 'done',
}
@Entity()
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column()
  title: string;

  @Column()
  message: string | null;

  @Column()
  state: CardState;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;

  @Column({ name: 'archived_at' })
  archivedAt: Date | null;

  @ManyToOne(() => User, (_) => _.cards)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Comment, (_) => _.card)
  @JoinColumn({ name: 'card_id' })
  comments: Comment[];
}
