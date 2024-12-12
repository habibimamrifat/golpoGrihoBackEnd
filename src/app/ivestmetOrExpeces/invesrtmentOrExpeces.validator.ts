import { z } from 'zod';

// Zod Schema for Investment Cycle
const InvestmentCycleIputZodValSchema =  z.object({
  body:z.object({
    id: z.string(),
  cycleDetail: z.string(),
  cycleType: z.enum(['investmentReturn', 'reInvest']), 
  amount: z.number().positive('Amount must be a positive number'), 
  proofImg: z.string() 
  })
});

// Zod Schema for Investment or Expenses
const InvestOrExpensesZodValSchema = z.object({
  body:z.object({
    motiveName: z.string().min(1, 'Motive name is required'),
    ExpencesType: z.enum(['investment', 'expence']),
    ammountSpent: z.number().positive('Amount spent must be a positive number'),
  })

});

export { InvestmentCycleIputZodValSchema, InvestOrExpensesZodValSchema };
