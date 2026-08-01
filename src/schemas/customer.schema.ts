import { z } from "zod";

export const customerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(100),

  address: z
    .string()
    .trim()
    .min(10, "Address must be at least 10 characters"),

  landmark: z.string().trim().optional(),

  instructions: z.string().trim().optional(),
});

export type CustomerInput = z.infer<typeof customerSchema>;