import FastifyServer from '..';

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
