import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { exceptionHandler } from '@/common/utils';
import { ResponsePaginate, ResponsePost } from '@/common/interfaces';
import { Card } from '@/entity/card.entity';
import {
  CurrentUser,
  GetCurrentUser,
} from '@/common/decorators/current-user.decorator';
import {
  ArchiveCardDTO,
  CreateCardDTO,
  DeleteCardDTO,
  GetOneCardDTO,
  GetPaginationCardDTO,
  UpdateCardDTO,
  UpdateCardStateDTO,
} from './card.dto';
import { CardService } from './card.service';

@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}
  @Post()
  async create(
    @GetCurrentUser() user: CurrentUser,
    @Body() body: CreateCardDTO,
  ): Promise<{ id: number }> {
    try {
      body.userId = user.getId();
      const card = await this.cardService.create(body);
      return { id: card.id };
    } catch (error) {
      throw exceptionHandler(error);
    }
  }

  @Get()
  async getOne(@Query() query: GetOneCardDTO): Promise<Card> {
    try {
      const card = await this.cardService.getOne(query);
      return card;
    } catch (error) {
      throw exceptionHandler(error);
    }
  }

  @Delete()
  async delete(
    @GetCurrentUser() user: CurrentUser,
    @Body() body: DeleteCardDTO,
  ) {
    try {
      body.userId = user.getId();
      await this.cardService.delete(body);
      return {};
    } catch (error) {
      throw exceptionHandler(error);
    }
  }

  @Patch()
  async update(
    @GetCurrentUser() user: CurrentUser,
    @Body() body: UpdateCardDTO,
  ) {
    try {
      body.userId = user.getId();
      await this.cardService.update(body);
      return {};
    } catch (error) {
      throw exceptionHandler(error);
    }
  }

  @Get('pagination')
  async pagination(
    @Query() query: GetPaginationCardDTO,
  ): Promise<ResponsePaginate<ResponsePost>> {
    try {
      const card = await this.cardService.pagination(query);
      return card;
    } catch (error) {
      throw exceptionHandler(error);
    }
  }

  @Patch('archive')
  async archive(@Body() body: ArchiveCardDTO) {
    try {
      await this.cardService.archive(body);
      return {};
    } catch (error) {
      throw exceptionHandler(error);
    }
  }

  @Patch('state')
  async updateState(@Body() body: UpdateCardStateDTO) {
    try {
      await this.cardService.updateState(body);
      return {};
    } catch (error) {
      throw exceptionHandler(error);
    }
  }
}
