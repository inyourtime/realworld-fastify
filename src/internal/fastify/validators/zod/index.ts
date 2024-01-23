import { FastifyValidationResult } from 'fastify/types/schema';
import z from 'zod';
import { fromZodError } from 'zod-validation-error';
import { convertFormdataToObject, isFormdataFromBodyParser } from '..';

export const name = 'Zod';

export const identityCheck = (schema: unknown) => {
  return schema instanceof z.ZodType;
};

export const validate = (schema: unknown): FastifyValidationResult => {
  return (data: any) => {
    const zodParsedPayload = (<z.Schema>schema).safeParse(
      isFormdataFromBodyParser(data) ? convertFormdataToObject(data) : data,
    );

    if (zodParsedPayload.success) return zodParsedPayload.data;

    const validationError = fromZodError(zodParsedPayload.error);

    return {
      error: validationError,
    };
  };
};

export default {
  name,
  identityCheck,
  validate,
};
