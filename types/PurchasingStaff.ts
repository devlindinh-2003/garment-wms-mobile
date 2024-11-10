import { User } from './User';

export interface PurchasingStaff {
  id: string;
  userId: string;
  users: User;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
