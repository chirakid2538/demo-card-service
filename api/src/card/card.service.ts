import { InjectDataSource } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { MYSQL_MAIN, PERPAGE } from '@/common/constants';
import {
  ArchiveCardDTO,
  CreateCardDTO,
  GetOneCardDTO,
  GetPaginationCardDTO,
} from './card.dto';
import { Card } from '@/entity/card.entity';
import { ResponsePaginate, ResponsePost } from '@/common/interfaces';
import date from '@/common/utils/date.util';
import { EXCEPTION_COMMON } from '@/common/constants/exception';

@Injectable()
export class CardService {
  constructor(
    @InjectDataSource(MYSQL_MAIN)
    private readonly dataSource: DataSource,
  ) {}

  async create(params: CreateCardDTO): Promise<Card> {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.startTransaction();
      const card = new Card();
      card.userId = Number(params.userId);
      card.title = String(params.title);
      card.message = String(params.message);

      await queryRunner.manager.save(Card, card);
      await queryRunner.commitTransaction();
      return card;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getOne(params: GetOneCardDTO): Promise<Card> {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.startTransaction();
      const card = await queryRunner.manager.findOneByOrFail(Card, {
        id: Number(params.cardId),
        archivedAt: null,
      });
      await queryRunner.commitTransaction();
      return card;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async pagination(
    params: GetPaginationCardDTO,
  ): Promise<ResponsePaginate<ResponsePost>> {
    const queryRunner = await this.dataSource.createQueryRunner();
    try {
      const page = params.page ?? 1;
      const take = params.perpage ?? PERPAGE;
      const skip = take * (page - 1);

      const [cards, total] = await queryRunner.manager.findAndCount(Card, {
        take,
        skip,
        relations: {
          user: true,
        },
        select: {
          id: true,
          title: true,
          message: true,
          state: true,
          createdAt: true,
          user: {
            id: true,
            username: true,
          },
        },
        order: { id: 'DESC' },
      });

      const items: ResponsePost[] = cards.map((card) => ({
        id: card.id,
        title: card.title,
        message: card.message,
        state: card.state,
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

  async archive(params: ArchiveCardDTO) {
    const queryRunner = await this.dataSource.createQueryRunner();
    try {
      await queryRunner.startTransaction();
      const result = await queryRunner.manager.update(
        Card,
        { id: Number(params.cardId), archivedAt: null },
        { archivedAt: date().toDate() },
      );

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
}
