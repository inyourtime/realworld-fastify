import fastify, {
  FastifyInstance,
  FastifyPluginCallback,
  FastifyPluginOptions,
} from 'fastify';
import { IRouterConfig } from './Server.Interface';
import path from 'path';
import { glob } from 'glob';
import cors from '@fastify/cors';
import authenticate from '../../plugins/authenticate';

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

  private addPlugin(
    plugin: FastifyPluginCallback,
    options: FastifyPluginOptions = {},
  ): FastifyServer {
    this._server.register(plugin, options);
    return this;
  }

  private addRouter(config?: IRouterConfig): FastifyServer {
    const defaultArgs: IRouterConfig = {
      routerFolder: '../../routes/**/*.Route.@(js|ts)',
      prefix: 'api',
    };

    const target = Object.assign({}, defaultArgs, config);

    const routeFolder = path.resolve(
      __dirname,
      target.routerFolder.replace(/\\/g, '/'),
    );
    const preRoutePaths = glob.sync(routeFolder);
    const routePaths = preRoutePaths.flat(Infinity);

    routePaths.forEach((routePath) => {
      this._server.register(require(routePath), { prefix: target.prefix });
    });

    return this;
  }

  public bootstrap() {
    this.addPlugin(cors)
      .addPlugin(authenticate)
      .addRouter({
        routerFolder: '../fastify/routes/**/*.Route.@(js|ts)',
        prefix: 'service',
      })
      .addRouter();
    return this;
  }

  public start(port: number): Promise<FastifyServer> {
    return new Promise((resolve, reject) => {
      this._server
        .listen({ port })
        .then(() => {
          console.log('[Server] has been initialized!');
          this._server.ready().then(() => resolve(this));
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
