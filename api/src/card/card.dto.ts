import { Exclude, Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { PERPAGE_MAX } from '@/common/constants';
import { CardState } from '@/entity/card.entity';

export class CreateCardDTO {
  @Exclude()
  userId: number;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  message: string;
}

export class GetOneCardDTO {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  cardId: number;
}

export class DeleteCardDTO {
  @Exclude()
  userId: number;

  @IsInt()
  @Min(1)
  cardId: number;
}

export class UpdateCardDTO {
  @Exclude()
  userId: number;

  @IsInt()
  @Min(1)
  cardId: number;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  message: string;
}

export class GetPaginationCardDTO {
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

  @IsOptional()
  @IsEnum(CardState)
  state?: CardState;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  query?: string;
}

export class ArchiveCardDTO {
  @IsInt()
  @Min(1)
  cardId: number;
}

export class UpdateCardStateDTO {
  @IsInt()
  @Min(1)
  cardId: number;

  @IsEnum(CardState)
  state: CardState;
}
