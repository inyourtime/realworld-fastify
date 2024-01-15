import Fastify from 'fastify';
import plugin, {
  ERR_MISSING_AUTHEN,
  ERR_TOKEN_EXPIRED,
  ERR_TOKEN_INVALID,
} from '../authenticate';
import { generateAccessToken } from '../../utils/token';

describe('Test authentication plugin', () => {
  it('set config authen to false', async () => {
    const fastify = Fastify();
    fastify.register(plugin);
    fastify.route({
      method: 'GET',
      url: '/test1',
      config: {
        auth: false,
      },
      handler: (req, res) => ({ message: 'done' }),
    });

    const res = await fastify.inject({ method: 'GET', url: '/test1' });
    expect(res.statusCode).toBe(200);
  });

  it('no authen header', async () => {
    const fastify = Fastify();
    fastify.register(plugin);
    fastify.route({
      method: 'GET',
      url: '/test2',
      config: {
        auth: true,
      },
      handler: (req, res) => ({ message: 'done' }),
    });

    const res = await fastify.inject({ method: 'GET', url: '/test2' });
    expect(res.statusCode).toBe(ERR_MISSING_AUTHEN.statusCode);
    expect(JSON.parse(res.body).message).toEqual(ERR_MISSING_AUTHEN.message);
  });

  it('authen header not Bearer', async () => {
    const fastify = Fastify();
    fastify.register(plugin);
    fastify.route({
      method: 'GET',
      url: '/test3',
      config: {
        auth: true,
      },
      handler: (req, res) => ({ message: 'done' }),
    });

    const res = await fastify.inject({
      method: 'GET',
      url: '/test3',
      headers: { authorization: 'Auth asdf' },
    });
    expect(res.statusCode).toBe(ERR_MISSING_AUTHEN.statusCode);
    expect(JSON.parse(res.body).message).toEqual(ERR_MISSING_AUTHEN.message);
  });

  it('token invalid', async () => {
    const fastify = Fastify();
    fastify.register(plugin);
    fastify.route({
      method: 'GET',
      url: '/test4',
      config: {
        auth: true,
      },
      handler: (req, res) => ({ message: 'done' }),
    });

    const res = await fastify.inject({
      method: 'GET',
      url: '/test4',
      headers: { authorization: 'Bearer asdf' },
    });
    expect(res.statusCode).toBe(ERR_TOKEN_INVALID.statusCode);
    expect(JSON.parse(res.body).message).toEqual(ERR_TOKEN_INVALID.message);
  });

  it('token expired', async () => {
    const fastify = Fastify();
    fastify.register(plugin);
    fastify.route({
      method: 'GET',
      url: '/test5',
      config: {
        auth: true,
      },
      handler: (req, res) => ({ message: 'done' }),
    });

    const token = generateAccessToken({}, undefined, { expiresIn: '1' });

    const res = await fastify.inject({
      method: 'GET',
      url: '/test5',
      headers: { authorization: `Bearer ${token}` },
    });
    expect(res.statusCode).toBe(ERR_TOKEN_EXPIRED.statusCode);
    expect(JSON.parse(res.body).message).toEqual(ERR_TOKEN_EXPIRED.message);
  });

  it('authen success', async () => {
    const fastify = Fastify();
    fastify.register(plugin);
    fastify.route({
      method: 'GET',
      url: '/test6',
      config: {
        auth: true,
      },
      handler: (req, res) => ({ message: 'done' }),
    });

    const token = generateAccessToken({}, undefined, { expiresIn: '1d' });

    const res = await fastify.inject({
      method: 'GET',
      url: '/test6',
      headers: { authorization: `Bearer ${token}` },
    });
    expect(res.statusCode).toBe(200);
  });
});
