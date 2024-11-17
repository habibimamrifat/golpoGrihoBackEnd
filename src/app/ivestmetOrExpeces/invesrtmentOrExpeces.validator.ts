import { z } from 'zod';

// Zod Schema for Investment Cycle
const InvestmentCycleIputZodValSchema = z.object({
  cyclename: z.string().min(1, 'Cycle name is required'),
  cycleType: z.enum(['reinvest', 'profit', 'loss']),
  ammount: z.number().positive('Amount must be a positive number'),
  proofImg: z.string().optional(),
});

// Zod Schema for Investment or Expenses
const InvestOrExpensesZodValSchema = z.object({
  motiveName: z.string().min(1, 'Motive name is required'),
  ExpencesType: z.enum(['investment', 'expence']),
  ammountSpent: z.number().positive('Amount spent must be a positive number'),
  profitGenareted: z
    .number()
    .nonnegative('Amount generated cannot be negative')
    .default(0)
    .optional(),
    madeLoss: z
    .number()
    .nonnegative('Amount generated cannot be negative')
    .default(0)
    .optional(),
  expenceImg: z.string().optional(),
  investmentCycle: z.array(InvestmentCycleIputZodValSchema).optional(),
});

export { InvestmentCycleIputZodValSchema, InvestOrExpensesZodValSchema };
