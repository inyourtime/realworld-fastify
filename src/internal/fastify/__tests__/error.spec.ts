import FastifyServer from '..';

describe('Test error handler plugin', () => {
  it('Should retuen error 500', async () => {
    const server = new FastifyServer().setErrorHandler().getServer(true);
    server.get('/test', (req, res) => {
      throw new Error('error');
    });

    const result = await server.inject({ url: '/test', method: 'GET' });

    expect(result.statusCode).toEqual(500);
    expect(JSON.parse(result.body).message).toEqual('error');
  });
});
