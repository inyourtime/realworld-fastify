import fastify, {
  FastifyInstance,
  FastifyPluginCallback,
  FastifyPluginOptions,
} from 'fastify';

export default class FastifyServer {
  private static instance: FastifyServer;
  private _server: FastifyInstance;

  private constructor() {
    this._server = fastify();
  }

  public static getInstance(): FastifyServer {
    if (!FastifyServer.instance) {
      FastifyServer.instance = new FastifyServer();
    }
    return FastifyServer.instance;
  }

  public addPlugin(
    plugin: FastifyPluginCallback,
    options: FastifyPluginOptions = {},
  ): FastifyServer {
    this._server.register(plugin, options);
    return this;
  }

  public start(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._server
        .listen({ port: 3000 })
        .then(() => {
          console.log('[Server] has been initialized!');
          this._server.ready().then(() => resolve(true));
        })
        .catch((e) => reject(e));
    });
  }

  public stop(): Promise<void> {
    return this._server.close();
  }

  public getServer(): FastifyInstance {
    return this._server;
  }
}
