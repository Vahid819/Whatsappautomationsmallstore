import { ConversationState } from "@/types/conversation";

export interface Customer {
    id: string;
  phone: string;
  state: ConversationState;

  name?: string;
  address?: string;
  mobile?: string;

  selectedItemId?: string;
  selectedItemName?: string;
  selectedItemPrice?: number;
  quantity?: number;
}

export interface Customers {
  id: string;

  name: string;

  phone: string;

  address: string;

  landmark?: string;

  instructions?: string;

  createdAt: string;

  updatedAt: string;
}