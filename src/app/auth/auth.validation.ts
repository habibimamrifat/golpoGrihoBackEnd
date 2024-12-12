import { z } from 'zod';

// Schema for logIn
export const logInSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'email is must for log in' }),
    password: z.string({ required_error: 'pasworrd is must for log in' }),
  }),
});

// Schema for changePassword
export const changePasswordSchema = z.object({
  body:z.object({
    oldPassword: z.string({
    required_error: 'old pasworrd is must for change Password',
  }),
  newPassword: z.string({
    required_error: 'new pasworrd is must for change Password',
  }),
  })
});

export const refreshTokenSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'rfresh token is a must for new token',
    }),
  }),
});
