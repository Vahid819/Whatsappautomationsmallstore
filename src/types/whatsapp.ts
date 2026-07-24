// src/types/whatsapp.ts

export interface WhatsAppWebhook {
  object: string;
  entry: Entry[];
}

export interface Entry {
  id: string;
  changes: Change[];
}

export interface Change {
  field: string;
  value: Value;
}

export interface Value {
  messaging_product: string;
  metadata: Metadata;

  contacts?: Contact[];
  messages?: Message[];

  // Added for message status updates
  statuses?: Status[];
}

export interface Metadata {
  display_phone_number: string;
  phone_number_id: string;
}

export interface Contact {
  profile?: {
    name: string;
  };

  wa_id: string;
  user_id?: string;
}

export interface Message {
  from: string;
  from_user_id?: string;

  id: string;
  timestamp: string;

  type: "text";

  text: {
    body: string;
  };
}

export interface Status {
  id: string;

  status: "sent" | "delivered" | "read" | "failed";

  timestamp: string;

  recipient_id: string;
  recipient_user_id?: string;

  pricing?: {
    billable: boolean;
    pricing_model: string;
    category: string;
    type: string;
  };
}