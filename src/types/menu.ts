export interface Menu {
  id: string;
  productNumber: number;
  name: string;
  variant: string;
  description: string;
  category: string;
  price: number;
  available: boolean;
  image?: string;
  createdAt?: string | null;
  updatedAt?: string | null;
}