import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { MYSQL_MAIN, PERPAGE } from '@/common/constants';
import { Comment } from '@/entity/comment.entity';
import { CreateCommentDTO, GetPaginationCommentDTO } from './comment.dto';
import { ResponseComment, ResponsePaginate } from '@/common/interfaces';

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
          user: {
            id: true,
            username: true,
          },
        },
        order: { id: 'DESC' },
      });

      const items: ResponseComment[] = cards.map((card) => ({
        id: card.id,
        message: card.message,
        createdAt: card.createdAt,
        user: {
          id: card.user.id,
          username: card.user.username,
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
