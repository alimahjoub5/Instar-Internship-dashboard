export interface User {
  _id?: string;
  firstName: string;
  lastName: string;
  imageUrl?: string;
  cart?: string[];
  wishlist?: string[];
  email: string;
  recoveryEmail?: string;
  OAuth?: string;
  address?: string;
  phone?: string;
  password: string;
  ban?: boolean;
  role: 'user' | 'vendor' | 'admin';
  gender?: 'male' | 'female' | '';
  birthDate?: string;
  createdAt?: Date;
  updatedAt?: Date;
} 