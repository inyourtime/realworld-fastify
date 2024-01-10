import z from 'zod';
import { fromZodError } from 'zod-validation-error';

export const name = 'Zod';

export const indentityCheck = (schema: unknown) => {
  return schema instanceof z.ZodType;
};

export const validate = (schema: unknown) => {
  return (data: unknown) => {
    const zodParsedPayload = (<z.Schema>schema).safeParse(data);

    if (zodParsedPayload.success) return zodParsedPayload.data;

    const validationError = fromZodError(zodParsedPayload.error);

    return {
      error: validationError,
    };
  };
};

export default {
  name,
  indentityCheck,
  validate,
};
