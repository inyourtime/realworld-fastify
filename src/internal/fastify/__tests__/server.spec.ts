import FastifyServer from '..';
import to from '../../../utils/await-to-js';

describe('test fastify server', () => {
  it('test server start success', async () => {
    let server: FastifyServer | undefined;
    try {
      server = await new FastifyServer().bootstrap().start(3333);
    } catch (e) {
      console.log(e);
    }
    expect(server).toBeDefined();
    if (server) {
      server.stop();
    }
  });

  it('test error server already listening', async () => {
    const server = await new FastifyServer().bootstrap().start(3333);
    let e: Error | undefined;

    const [err, server2] = await to(
      new FastifyServer().bootstrap().start(3333),
    );
    if (err) {
      e = err;
    }

    expect(server).toBeDefined();
    expect(e).toBeDefined();
    server.stop();
  });
});
