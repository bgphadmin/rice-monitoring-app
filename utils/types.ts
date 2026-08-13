export type actionFunction = (
  prevState: unknown,
  formData: FormData
) => Promise<{ message: string }>;

export type RiceOption = {
  id: string;
  name: string;
};

export type DistributionRow = {
  id: string;
  firstName: string;
  lastName: string;
  employeeId: string;
  rice: { name: string; id: string };
  quantityKg: number;
  comment: string | null;
  dateGiven: string;
  createdBy: { firstName: string; lastName: string };
};