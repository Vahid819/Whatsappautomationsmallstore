import { z } from "zod";

export const productSchema = z.object({
  productNumber: z.number().optional(),

  name: z
    .string()
    .trim()
    .min(2, "Product name must be at least 2 characters")
    .max(100, "Product name must be less than 100 characters"),

  description: z
    .string()
    .trim()
    .min(5, "Description must be at least 5 characters")
    .max(500, "Description must be less than 500 characters"),

  category: z
    .string()
    .trim()
    .min(2, "Category is required"),

  price: z
    .number()
    .positive("Price must be greater than 0"),

  available: z.boolean(),

  image: z.string().optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;