export interface ProductVariant {
  color: string;
  stock: number;
}

export interface Product {
  _id: string;
  slug: string;
  name: string;

  description: string;

  imageUrl: string;
  price: number;

  category: string;

  variants: ProductVariant[];

  tags?: string[];

  isDeleted?: boolean;

  createdAt?: string;
  updatedAt?: string;
}
