import { Module } from '@nestjs/common';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [CommentModule],
  controllers: [CardController],
  providers: [CardService],
})
export class CardModule {}
