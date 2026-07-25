

export interface Menu {
  id: string;

  name: string;

  description: string;

  category: string;

  price: number;

  image?: string;

  available: boolean;

  featured: boolean;

  preparationTime: number;

  createdAt: Date;

  updatedAt: Date;
}