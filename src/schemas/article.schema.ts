import z from 'zod';

export const baseArticleQuery = z.object({
  limit: z.number().default(20),
  offset: z.number().default(0),
});

export const articleListQuery = baseArticleQuery.extend({
  tag: z.string().optional(),
  author: z.string().optional(),
  favorited: z.string().optional(),
});

export const articleCreateSchema = z.object({
  article: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    body: z.string().min(1),
    tagList: z.string().min(1).array().nonempty().optional(),
  }),
});

export const articleUpdateSchema = z.object({
  article: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    body: z.string().optional(),
  }),
});

export type TArticlesListQuery = z.infer<typeof articleListQuery>;
export type TBaseArticleQuery = z.infer<typeof baseArticleQuery>;
export type TArticleCreateSchema = z.infer<typeof articleCreateSchema>;
export type TArticleUpdateSchema = z.infer<typeof articleUpdateSchema>;
