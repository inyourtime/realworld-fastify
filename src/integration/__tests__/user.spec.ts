import {
  cleanData,
  connect,
  disconnect,
} from '../../__helper__/mongo.memory.test.helper';
import FastifyServer from '../../internal/fastify';

describe('test', () => {
  beforeAll(connect);
  beforeEach(cleanData);
  afterAll(disconnect);

  it('test1', async () => {
    const res = await new FastifyServer().getServer().inject({
      method: 'GET',
      url: '/service/hc',
    });
    console.log(JSON.parse(res.payload));
    expect(true).toBe(true);
  });
});
