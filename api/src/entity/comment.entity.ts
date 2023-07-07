import {
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';
import { Card } from './card.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'card_id' })
  cardId: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column()
  message: string | null;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;

  @ManyToOne(() => User, (_) => _.comments)
  user: User;

  @ManyToOne(() => Card, (_) => _.comments)
  card: Card;
}
