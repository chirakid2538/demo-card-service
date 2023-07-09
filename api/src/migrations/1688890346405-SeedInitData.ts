import { hash } from '@/common/utils';
import { Card } from '@/entity/card.entity';
import { Comment } from '@/entity/comment.entity';
import { User } from '@/entity/user.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedInitData1688890346405 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      const user: Partial<User> = {
        displayName: 'Demo account',
        email: 'demo@gmail.com',
        password: await hash.encode('123456789'),
      };
      await queryRunner.manager.save(User, user);

      for (let index = 0; index < 5; index++) {
        const card: Partial<Card> = {
          userId: user.id,
          title: `สวัสดีชาวโลก ${index}`,
          message: 'Hi......',
        };
        await queryRunner.manager.save(Card, card);

        for (let commentIndex = 0; commentIndex < 10; commentIndex++) {
          const comment: Partial<Comment> = {
            userId: user.id,
            cardId: card.id,
            message: `ตอบคนที่ ${commentIndex + 1} เย้ๆ`,
          };
          await queryRunner.manager.save(Comment, comment);
        }
      }
    } catch (error) {}
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    //
  }
}
