import { Comment } from '@/entity/comment.entity';

export type ResponseComment = Pick<Comment, 'id' | 'message' | 'createdAt'> & {
  user: Pick<Comment['user'], 'id' | 'username'>;
};
