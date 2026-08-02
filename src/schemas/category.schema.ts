import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Category name must be at least 2 characters")
    .max(50, "Category name is too long"),

  icon: z
    .string()
    .trim()
    .min(1, "Please select an icon")
    .max(5),
});

export type CategoryFormValues = z.infer<
  typeof categorySchema
>;