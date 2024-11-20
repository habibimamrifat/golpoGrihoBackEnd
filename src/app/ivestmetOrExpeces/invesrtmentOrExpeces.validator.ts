import { z } from 'zod';

// Zod Schema for Investment Cycle
const InvestmentCycleIputZodValSchema = z.object({
  id: z.string(),
  cycleInput: z.object({
    cycleDetail: z.string(),
    cycleType: z.enum(["investmentReturn", "reInvest"]),
    amount: z.number().min(0, "Amount must be a positive number"),
    proofImg: z.string().url("Proof image must be a valid URL"),
  }),
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
