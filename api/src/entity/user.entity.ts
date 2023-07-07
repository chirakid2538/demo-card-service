import { hash } from '@/common/utils';
import {
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Card } from './card.entity';
import { Comment } from './comment.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;

  @OneToMany(() => Card, (_) => _.user)
  cards: Card[];

  @OneToMany(() => Comment, (_) => _.user)
  comments: Comment[];

  public async validPassword(password): Promise<boolean> {
    return await hash.compare(password, this.password);
  }
}
