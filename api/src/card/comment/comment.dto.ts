import { PERPAGE_MAX } from '@/common/constants';
import { Exclude, Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateCommentDTO {
  @Exclude()
  userId: number;

  @IsInt()
  @Min(1)
  cardId;

  @IsNotEmpty()
  @IsString()
  message: string;
}

export class DeleteCommentDTO {
  @Exclude()
  userId: number;

  @IsInt()
  @Min(1)
  cardId;

  @IsInt()
  @Min(1)
  commentId;
}

export class GetPaginationCommentDTO {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(PERPAGE_MAX)
  perpage: number;
}
