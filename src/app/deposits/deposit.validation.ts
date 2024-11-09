import { number, z } from 'zod';

// Define the TMonth type as an enum using Zod
const MonthSchema = z.enum([
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
]);

// Define the TDeposit schema
const DepositSchema = z.object({
  year: z.string().min(4, "Year must have at least 4 characters (e.g., 2023)"), // Assuming year is a 4-character string
  month: MonthSchema,
  depositAmount: z.number().min(0, "Deposit amount must be non-negative"),
  status:z.enum(["waiting", "declined", "approved"]).default("waiting")
});

// Define the TDepositList schema
export const DepositListSchema = z.object({
  id: z.string(),
  totalDeposit:z.number().optional(),
  depositList: z.array(DepositSchema).default([]),
});

export const makeADepositSchema = z.object({
  id: z.string(),
  deposit: DepositSchema
});

