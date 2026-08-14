// src/services/whatsapp.service.ts

import axios from "axios";

const API_URL = `https://graph.facebook.com/v23.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

export async function sendTextMessage(
  to: string,
  message: string
) {
  try {
    const response = await axios.post(
      API_URL,
      {
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: {
          body: message,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "❌ Failed to send message:",
      error.response?.data || error.message
    );

    throw error;
  }
}