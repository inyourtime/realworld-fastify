import Fastify, {
  FastifyInstance,
  FastifyPluginCallback,
  FastifyPluginOptions,
} from 'fastify';
import { IRouterConfig } from './server.interface';
import path from 'path';
import { glob } from 'glob';
import cors from '@fastify/cors';
import authenticate from '../../plugins/authenticate';
import zodValidation from './validators/zod';
import errorHandler from './error';

export default class FastifyServer {
  private _server: FastifyInstance;

  constructor() {
    this._server = Fastify();
  }

  private addPlugin(
    plugin: FastifyPluginCallback,
    options: FastifyPluginOptions = {},
  ): FastifyServer {
    this._server.register(plugin, options);
    return this;
  }

  private addRouter(config?: IRouterConfig | undefined): FastifyServer {
    const defaultArgs: IRouterConfig = {
      routerFolder: '../../routes/**/*.route.@(js|ts)',
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

  public setErrorHandler() {
    this._server.setErrorHandler(errorHandler);
    return this;
  }

  public setValidatorCompiler() {
    this._server.setValidatorCompiler(({ schema }) => {
      const validation = zodValidation;
      return validation.validate(schema);
    });
    return this;
  }

  public bootstrap() {
    this.setValidatorCompiler()
      .setErrorHandler()
      .addPlugin(cors)
      .addPlugin(authenticate)
      .addRouter({
        routerFolder: '../fastify/routes/**/*.route.@(js|ts)',
        prefix: 'service',
      })
      .addRouter();
    return this;
  }

  public start(port: number): Promise<FastifyServer> {
    return new Promise((resolve, reject) => {
      this._server
        .listen({ port })
        .then(() => resolve(this))
        .catch((e) => reject(e));
    });
  }

  public stop(): Promise<void> {
    return this._server.close();
  }

  public getServer(lean: boolean = false): FastifyInstance {
    if (!lean) {
      this.bootstrap();
    }
    return this._server;
  }
}
