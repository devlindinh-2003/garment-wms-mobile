export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  code: string;
  image?: string | null; // URL to the product variant image
  createdAt: string; // ISO format datetime string
  updatedAt: string; // ISO format datetime string
  deletedAt?: string | null; // ISO format datetime string
  productAttribute?: any[]; // Array of attributes (e.g., color, size)
  product?: any; // Reference to the parent product
}
