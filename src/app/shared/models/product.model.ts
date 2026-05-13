export interface ProductVariant {
  color: string;
  size?: string;
  stock: number;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  isDeleted: boolean;
  __v?: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface Product {
  _id: string;
  slug: string;
  name: string;

  description: string;

  imageUrl: string;
  price: number;

  category: Category;

  variants: ProductVariant[];

  tags?: string[];

  isDeleted?: boolean;
  isFeatured?: boolean;

  createdAt?: string | Date;
  updatedAt?: string | Date;
}
