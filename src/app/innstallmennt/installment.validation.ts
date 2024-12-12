import { number, z } from 'zod';

// Define the TMonth type as an enum using Zod
const MonthSchema = z.enum([
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]);

// Define the TDeposit schema
const InstallmentZodSchema = z.object({
  
    year: z
      .string()
      .min(4, 'Year must have at least 4 characters (e.g., 2023)'), // Assuming year is a 4-character string
    month: MonthSchema,
    numberOfMonth: z
      .number()
      .min(1, { message: 'Number of months must be at least 1' })
      .max(12, { message: 'Number of months must not exceed 12' })
      .default(1),
    installmentAmount: z
      .number()
      .min(1000, 'Deposit amount must be non-negative'),
    status: z.enum(['waiting', 'declined', 'approved']).default('waiting'),
    installmentDate: z.date().optional(),
 
});

// Define the TDepositList schema
export const InstallmenntZodListSchema = z.object({
  id: z.string(),
  totalDeposit: z.number().optional(),
  installmentList: z.array(InstallmentZodSchema).default([]),
  sDelited: z.boolean().default(false),
});

export const MakeAInstallmentZodSchema = z.object({
  body:z.object({
    deposit: InstallmentZodSchema,
  })
 
});
