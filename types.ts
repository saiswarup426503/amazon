
export enum ProductStatus {
  DRAFT = 'Draft',
  PUBLISHED = 'Published',
  SCHEDULED = 'Scheduled',
}

export interface Product {
  id: string;
  title: string;
  price: string;
  description: string;
  rating: number;
  reviewSummary: string;
  images: string[]; // Array of base64 encoded images
  affiliateLink: string;
  status: ProductStatus;
  publishDate: string; // ISO string
  created_at?: string;
  updated_at?: string;
}
