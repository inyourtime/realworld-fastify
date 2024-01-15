import z from 'zod';

export const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const userCreateSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
});

export const userUpdateSchema = z.object({
  user: z.object({
    email: z.string().email().optional(),
    username: z.string().optional(),
    password: z.string().optional(),
    image: z.string().optional(),
    bio: z.string().optional(),
  }),
});

export type TUserLoginSchema = z.infer<typeof userLoginSchema>;
export type TUserCreateSchema = z.infer<typeof userCreateSchema>;
export type TUserUpdateSchema = z.infer<typeof userUpdateSchema>;
