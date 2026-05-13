export interface User {
  _id?: string;
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  role: 'user' | 'admin';
  createdAt?: string | Date;
}
