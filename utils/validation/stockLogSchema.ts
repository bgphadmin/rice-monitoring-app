import { z } from "zod"

export const stockLogSchema = z.object({
  riceId: z.string().min(1, "Rice selection is required"),
  quantityKg: z.coerce.number().int().min(1, "Quantity must be at least 1 kg"),
  comment: z.string().optional(),
  action: z.enum(["ADD", "REMOVE"]),
})

export type StockLogSchemaType = z.infer<typeof stockLogSchema>
