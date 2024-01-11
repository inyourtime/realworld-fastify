import { error } from 'console';
import FastifyServer from '../../internal/fastify';

describe('test fastify server', () => {
  it('test server start success', async () => {
    let server: FastifyServer;
    try {
      server = await new FastifyServer().bootstrap().start(3333);
    } catch (e) {
      throw e;
    }
    expect(server).toBeDefined();
    server.stop();
  });

  it('test error server already listening', async () => {
    const server = await new FastifyServer().bootstrap().start(3333);
    let e: Error | undefined;
    try {
      const server2 = await new FastifyServer().bootstrap().start(3333);
    } catch (error: any) {
      e = error;
    }
    expect(server).toBeDefined();
    expect(e).toBeDefined();
    server.stop();
  });
});
