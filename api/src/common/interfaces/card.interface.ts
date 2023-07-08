import { Card } from '@/entity/card.entity';

export type ResponsePost = Pick<
  Card,
  'id' | 'title' | 'message' | 'state' | 'createdAt' | 'updatedAt'
> & {
  user: Pick<Card['user'], 'id' | 'displayName' | 'email' | 'profileImageURL'>;
};
