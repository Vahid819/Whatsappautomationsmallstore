export interface Menu {
  id: string;

  productNumber: number;

  category: string;

  name: string;

  variant: string;

  description: string;

  price: number;

  available: boolean;

  featured?: boolean;

  preparationTime?: number;

  image?: string;

  createdAt?: string | null;
  updatedAt?: string | null;
}