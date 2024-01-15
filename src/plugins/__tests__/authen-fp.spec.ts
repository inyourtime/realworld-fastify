import Fastify from 'fastify';
import plugin, {
  ERR_MISSING_AUTHEN,
  ERR_TOKEN_EXPIRED,
  ERR_TOKEN_INVALID,
} from '../authenticate';
import { generateAccessToken } from '../../utils/token';
import { STATUS_CODE } from '../../internal/fastify/responseHandler/statusCode';

const testCase = [
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
    headerToken: 'Bearer asdf',
    expectedCode: ERR_TOKEN_INVALID.statusCode,
    expectedErrMessage: ERR_TOKEN_INVALID.message,
  },
  {
    auth: true,
    headerToken: `Bearer ${generateAccessToken({}, undefined, {
      expiresIn: '1',
    })}`,
    expectedCode: ERR_TOKEN_EXPIRED.statusCode,
    expectedErrMessage: ERR_TOKEN_EXPIRED.message,
  },
  {
    auth: true,
    headerToken: `Bearer ${generateAccessToken({}, undefined, {
      expiresIn: '1d',
    })}`,
    expectedCode: STATUS_CODE.OK,
    expectedErrMessage: '',
  },
];

describe('Test authentication plugin', () => {
  it.each(testCase)('test 1 2 3 4', async (c) => {
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
