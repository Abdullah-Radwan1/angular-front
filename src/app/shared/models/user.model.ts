export interface User {
  _id: string;
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  role: 'user' | 'admin';
  isDeleted?: boolean;
  createdAt?: string | Date;
}
