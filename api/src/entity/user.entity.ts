import { hash } from '@/common/utils';
import {
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Card } from './card.entity';
import { Comment } from './comment.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'display_name' })
  displayName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ name: 'profile_image' })
  profileImage: string | null;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;

  @OneToMany(() => Card, (_) => _.user)
  @JoinColumn({ name: 'user_id' })
  cards: Card[];

  @OneToMany(() => Comment, (_) => _.user)
  @JoinColumn({ name: 'user_id' })
  comments: Comment[];

  profileImageURL?: string | null;

  public async validPassword(password: string): Promise<boolean> {
    return await hash.compare(password, this.password);
  }

  public getProfileImageURL(): string | null {
    const baseURL = process.env.CDN_BASE_URL;
    if (!Boolean(baseURL) || !Boolean(this.profileImage)) {
      return null;
    }
    const path = String(this.profileImage).replace(/^public\//, '');
    return new URL(`${baseURL}/${path}`).toString();
  }
}
