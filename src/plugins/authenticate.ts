import { FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

export interface AuthenticatePluginOptions {
  // Specify Support plugin options here
}

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp<AuthenticatePluginOptions>(async (fastify, opts) => {
  // fastify.decorate('authen', function () {
  //   return 'authen'
  // })
  fastify.addHook(
    'onRequest',
    async (request: FastifyRequest, reply: FastifyReply) => {
      console.log(request.routeOptions.config.auth);
      // console.log('hello from hook');
    },
  );
});

// When using .decorate you have to specify added properties for Typescript
declare module 'fastify' {
  export interface FastifyContextConfig {
    auth?: boolean | string;
  }
}
