import { InjectDataSource } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Like } from 'typeorm';
import { MYSQL_MAIN, PERPAGE } from '@/common/constants';
import date from '@/common/utils/date.util';
import { EXCEPTION_COMMON } from '@/common/constants/exception';
import { ResponsePaginate, ResponsePost } from '@/common/interfaces';
import { Card } from '@/entity/card.entity';
import {
  ArchiveCardDTO,
  CreateCardDTO,
  DeleteCardDTO,
  GetOneCardDTO,
  GetPaginationCardDTO,
  UpdateCardStateDTO,
} from './card.dto';

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
      const card = await queryRunner.manager.findOneOrFail(Card, {
        where: {
          id: Number(params.cardId),
          archivedAt: null,
        },
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

  async delete(params: DeleteCardDTO): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.startTransaction();
      /**
       * เงื่อนไขการลบ
       * - ลบได้เฉพาะของตัวเลข หรือ มาการตั้งค่าบทบาทในระบบผู้ใช้งาน
       */
      const result = await queryRunner.manager.softDelete(Card, {
        id: Number(params.cardId),
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
        where: {
          ...(params.state ? { state: params.state } : {}),
          ...(params.query ? { title: Like(`%${params.query}%`) } : {}),
          archivedAt: null,
        },
        relations: {
          user: true,
        },
        select: {
          id: true,
          title: true,
          message: true,
          state: true,
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

      const items: ResponsePost[] = cards.map((card) => ({
        id: card.id,
        title: card.title,
        message: card.message,
        state: card.state,
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

  async archive(params: ArchiveCardDTO): Promise<void> {
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

  async updateState(params: UpdateCardStateDTO): Promise<void> {
    const cardId = Number(params.cardId);

    const queryRunner = await this.dataSource.createQueryRunner();
    try {
      await queryRunner.startTransaction();
      const result = await queryRunner.manager.update(
        Card,
        { id: cardId },
        { state: params.state },
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
