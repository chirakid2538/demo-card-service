import { Comment } from '@/entity/comment.entity';

export type ResponseComment = Pick<
  Comment,
  'id' | 'message' | 'createdAt' | 'updatedAt'
> & {
  user: Pick<
    Comment['user'],
    'id' | 'displayName' | 'email' | 'profileImageURL'
  >;
};
