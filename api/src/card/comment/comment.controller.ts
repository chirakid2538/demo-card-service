import { exceptionHandler } from '@/common/utils';
import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  CreateCommentDTO,
  DeleteCommentDTO,
  GetPaginationCommentDTO,
  UpdateCommentDTO,
} from './comment.dto';
import { CommentService } from './comment.service';
import { ResponseComment, ResponsePaginate } from '@/common/interfaces';
import {
  CurrentUser,
  GetCurrentUser,
} from 'src/decorators/current-user.decorator';

@Controller('card/comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}
  @Post()
  async create(
    @GetCurrentUser() user: CurrentUser,
    @Body() body: CreateCommentDTO,
  ): Promise<{ commentId: number }> {
    try {
      body.userId = user.getId();
      const comment = await this.commentService.create(body);
      return { commentId: comment.id };
    } catch (error) {
      throw exceptionHandler(error);
    }
  }

  @Patch()
  async update(
    @GetCurrentUser() user: CurrentUser,
    @Body() body: UpdateCommentDTO,
  ) {
    try {
      body.userId = user.getId();
      await this.commentService.update(body);
      return {};
    } catch (error) {
      throw exceptionHandler(error);
    }
  }

  @Delete()
  async delete(
    @GetCurrentUser() user: CurrentUser,
    @Body() body: DeleteCommentDTO,
  ) {
    try {
      body.userId = user.getId();
      await this.commentService.delete(body);
      return {};
    } catch (error) {
      throw exceptionHandler(error);
    }
  }

  @Get('pagination')
  async pagination(
    @Query() query: GetPaginationCommentDTO,
  ): Promise<ResponsePaginate<ResponseComment>> {
    try {
      return await this.commentService.pagination(query);
    } catch (error) {
      throw exceptionHandler(error);
    }
  }
}
