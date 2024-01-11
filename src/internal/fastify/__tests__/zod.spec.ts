import z from 'zod';
import FastifyServer from '..';
import { indentityCheck } from '../validators/zod';

describe('Test zod validator', () => {
  it('Test validate pass with return status 200 OK', async () => {
    // add validator
    const server = new FastifyServer().setValidatorCompiler().getServer(true);
    // test schema
    const schema = z.object({
      foo: z.string(),
      bar: z.number(),
    });
    // add test route
    server.route({
      method: 'POST',
      url: '/',
      schema: { body: schema },
      handler: async (request, reply) => request.body,
    });

    const payload = {
      foo: 'foo',
      bar: 99,
    };
    const res = await server.inject({
      method: 'POST',
      url: '/',
      payload,
    });

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.payload)).toEqual(payload);
  });

  it('Test validate fail with return status 400', async () => {
    const server = new FastifyServer().setValidatorCompiler().getServer(true);
    // test schema
    const schema = z.object({
      foo: z.string(),
      bar: z.number(),
    });
    // add test route
    server.route({
      method: 'POST',
      url: '/',
      schema: { body: schema },
      handler: async (request, reply) => request.body,
    });

    const payload = {
      foo: 'foo',
    };
    const res = await server.inject({
      method: 'POST',
      url: '/',
      payload,
    });

    expect(res.statusCode).toBe(400);
  });

  it('Test is zod', async () => {
    const schema = z.object({
      foo: z.string(),
      bar: z.number(),
    });
    const isZod = indentityCheck(schema);
    expect(isZod).toBe(true);
  });
});
