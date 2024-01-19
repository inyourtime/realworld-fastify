import Fastify from 'fastify';
import plugin, { ERR_MISSING_AUTHEN, ERR_TOKEN_EXPIRED, ERR_TOKEN_INVALID } from '../authenticate';
import { verifyToken } from '../../utils/token';
import { STATUS_CODE } from '../../internal/fastify/responseHandler/statusCode';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

jest.mock('../../utils/token.ts', () => ({
  verifyToken: jest.fn<ReturnType<typeof verifyToken>, [string, string]>(
    (token: string, secret: string) => ({
      error: null,
      result: 'success',
    }),
  ),
}));

const cases = [
  {
    auth: false,
    headerToken: '',
    expectedCode: STATUS_CODE.OK,
    expectedErrMessage: '',
  },
  {
    auth: true,
    headerToken: '',
    expectedCode: ERR_MISSING_AUTHEN.statusCode,
    expectedErrMessage: ERR_MISSING_AUTHEN.message,
  },
  {
    auth: true,
    headerToken: 'Auth asdf',
    expectedCode: ERR_MISSING_AUTHEN.statusCode,
    expectedErrMessage: ERR_MISSING_AUTHEN.message,
  },
  {
    auth: true,
    headerToken: `Bearer asdf`,
    expectedCode: STATUS_CODE.OK,
    expectedErrMessage: '',
  },
];

describe('Test authentication plugin', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('general case', () => {
    it.each(cases)('test 1 2 3 4', async (c) => {
      const fastify = Fastify();
      fastify.register(plugin);
      fastify.route({
        method: 'GET',
        url: '/test',
        config: {
          auth: c.auth,
        },
        handler: (req, res) => ({ message: 'done' }),
      });

      const res = await fastify.inject({
        method: 'GET',
        url: '/test',
        headers: { authorization: c.headerToken },
      });

      expect(res.statusCode).toBe(c.expectedCode);
      if (c.expectedCode !== STATUS_CODE.OK) {
        expect(JSON.parse(res.body).message).toEqual(c.expectedErrMessage);
      }
    });
  });

  describe('error case', () => {
    it('should invalid token', async () => {
      (verifyToken as jest.Mock<ReturnType<typeof verifyToken>>).mockReturnValueOnce({
        error: new JsonWebTokenError('invalid'),
        result: undefined,
      });

      const fastify = Fastify();
      fastify.register(plugin);
      fastify.route({
        method: 'GET',
        url: '/test',
        config: {
          auth: true,
        },
        handler: (req, res) => ({ message: 'done' }),
      });

      const res = await fastify.inject({
        method: 'GET',
        url: '/test',
        headers: { authorization: 'Bearer asdf' },
      });

      expect(res.statusCode).toBe(ERR_TOKEN_INVALID.statusCode);
      expect(JSON.parse(res.body).message).toEqual(ERR_TOKEN_INVALID.message);
    });

    it('should expired token', async () => {
      (verifyToken as jest.Mock<ReturnType<typeof verifyToken>>).mockReturnValueOnce({
        error: new TokenExpiredError('expired', new Date()),
        result: undefined,
      });

      const fastify = Fastify();
      fastify.register(plugin);
      fastify.route({
        method: 'GET',
        url: '/test',
        config: {
          auth: true,
        },
        handler: (req, res) => ({ message: 'done' }),
      });

      const res = await fastify.inject({
        method: 'GET',
        url: '/test',
        headers: { authorization: 'Bearer asdf' },
      });

      expect(res.statusCode).toBe(ERR_TOKEN_EXPIRED.statusCode);
      expect(JSON.parse(res.body).message).toEqual(ERR_TOKEN_EXPIRED.message);
    });

    it('not found route', async () => {
      const fastify = Fastify();
      fastify.register(plugin);
      fastify.route({
        method: 'GET',
        url: '/test',
        config: {
          auth: true,
        },
        handler: (req, res) => ({ message: 'done' }),
      });

      const res = await fastify.inject({
        method: 'GET',
        url: '/test1',
        headers: { authorization: 'Bearer asdf' },
      });

      expect(res.statusCode).toBe(STATUS_CODE.NOT_FOUND);
    });
  });

  it('Test authen is optinoal', async () => {
    const fastify = Fastify();
    fastify.register(plugin);
    fastify.route({
      method: 'GET',
      url: '/test',
      config: {
        auth: 'OPTIONAL',
      },
      handler: (req, res) => ({ message: 'done' }),
    });

    const res = await fastify.inject({ method: 'GET', url: '/test' });

    expect(res.statusCode).toBe(STATUS_CODE.OK);
  });
});
