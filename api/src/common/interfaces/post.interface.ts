import { Card } from '@/entity/card.entity';

export type ResponsePost = Pick<
  Card,
  'id' | 'title' | 'message' | 'state' | 'createdAt'
> & {
  user: Pick<Card['user'], 'id' | 'username'>;
};
