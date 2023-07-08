import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { MYSQL_MAIN, PERPAGE } from '@/common/constants';
import { ResponseComment, ResponsePaginate } from '@/common/interfaces';
import { EXCEPTION_COMMON } from '@/common/constants/exception';
import { Comment } from '@/entity/comment.entity';
import {
  CreateCommentDTO,
  DeleteCommentDTO,
  GetPaginationCommentDTO,
} from './comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectDataSource(MYSQL_MAIN)
    private readonly dataSource: DataSource,
  ) {}

  async create(params: CreateCommentDTO): Promise<Comment> {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.startTransaction();
      const comment = new Comment();
      comment.cardId = Number(params.cardId);
      comment.userId = Number(params.userId);
      comment.message = String(params.message);
      await queryRunner.manager.save(Comment, comment);
      await queryRunner.commitTransaction();
      return comment;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async delete(params: DeleteCommentDTO): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.startTransaction();
      /**
       * เงื่อนไขการลบ
       * - ลบได้เฉพาะของตัวเลข หรือ มาการตั้งค่าบทบาทในระบบผู้ใช้งาน
       */
      const result = await queryRunner.manager.softDelete(Comment, {
        id: Number(params.commentId),
        cardId: Number(params.cardId),
      });

      if (result.affected === 0) {
        throw new NotFoundException(EXCEPTION_COMMON.AFFECTED_ROWS_ZERO);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async pagination(
    params: GetPaginationCommentDTO,
  ): Promise<ResponsePaginate<ResponseComment>> {
    const queryRunner = await this.dataSource.createQueryRunner();
    try {
      const page = params.page ?? 1;
      const take = params.perpage ?? PERPAGE;
      const skip = take * (page - 1);

      const [cards, total] = await queryRunner.manager.findAndCount(Comment, {
        take,
        skip,
        relations: {
          user: true,
        },
        select: {
          id: true,
          message: true,
          createdAt: true,
          updatedAt: true,
          user: {
            id: true,
            displayName: true,
            email: true,
            profileImage: true,
          },
        },
        order: { id: 'DESC' },
      });

      const items: ResponseComment[] = cards.map((card) => ({
        id: card.id,
        message: card.message,
        createdAt: card.createdAt,
        updatedAt: card.updatedAt,
        user: {
          id: card.user.id,
          displayName: card.user.displayName,
          email: card.user.email,
          profileImageURL: card.user.getProfileImageURL(),
        },
      }));

      const pages = Math.ceil(total / take);
      return { page, pages, total, items };
    } catch (error) {
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
