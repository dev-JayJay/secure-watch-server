import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
}); 

export const createUserSchema = z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters long'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'), 
});

export const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
});