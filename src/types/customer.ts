import { ConversationState } from "@/types/conversation";

export interface Customer {
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