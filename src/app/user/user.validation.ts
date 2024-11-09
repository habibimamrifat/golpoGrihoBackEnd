import { z } from 'zod';

const userValidationSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export const userValidation =  {
    userValidationSchema
};