
import { z } from "zod";

export const employeeSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  employeeId: z.string().min(1, "Employee ID is required."),
  active: z.coerce.boolean().default(false),
  phone: z.string().optional(),
});

export type EmployeeSchemaType = z.infer<typeof employeeSchema>;