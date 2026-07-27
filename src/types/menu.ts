export interface Menu {
  id: string;
  productNumber: number;
  name: string;
  description: string;
  category: string;
  price: number;
  available: boolean;

  featured?: boolean;
  preparationTime?: number;

  image?: string;
  createdAt?: string | null;
  updatedAt?: string | null;
}