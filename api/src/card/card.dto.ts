import { Exclude, Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { PERPAGE_MAX } from '@/common/constants';

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
}

export class ArchiveCardDTO {
  @IsInt()
  @Min(1)
  cardId: number;
}
