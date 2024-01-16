import { FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import ApiError from '../internal/fastify/responseHandler/apiError';
import { STATUS_CODE } from '../internal/fastify/responseHandler/statusCode';
import { verifyToken } from '../utils/token';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { IAnyObject } from '../declarations/interfaces/base.interface';

export const ERR_MISSING_AUTHEN = ApiError.createError(
  'Missing authentication',
  STATUS_CODE.UNAUTHORIZED,
);
export const ERR_TOKEN_EXPIRED = ApiError.createError(
  'Token is expired',
  STATUS_CODE.FORBIDDEN,
);
export const ERR_TOKEN_INVALID = ApiError.createError(
  'Token is invalid',
  STATUS_CODE.FORBIDDEN,
);
export interface AuthenticatePluginOptions {
  // Specify Support plugin options here
}

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp<AuthenticatePluginOptions>(async (fastify, opts) => {
  fastify.addHook(
    'onRequest',
    async (request: FastifyRequest, reply: FastifyReply) => {
      if (request.is404) return;

      const routeOptions = request.routeOptions.config;
      if (routeOptions.auth === false) return;

      const authHeader = request.headers.authorization;
      if (!authHeader) {
        throw ERR_MISSING_AUTHEN;
      }

      const parts = authHeader.split(' ');
      if (parts.length !== 2 || parts[0] !== 'Bearer') {
        throw ERR_MISSING_AUTHEN;
      }

      const { error, result } = verifyToken(parts[1]);
      if (error) {
        switch (true) {
          case error instanceof TokenExpiredError:
            throw ERR_TOKEN_EXPIRED;
          case error instanceof JsonWebTokenError:
            throw ERR_TOKEN_INVALID;
        }
      }

      request.auth = <IAnyObject>result;
      return;
    },
  );
});

// When using .decorate you have to specify added properties for Typescript
declare module 'fastify' {
  export interface FastifyContextConfig {
    auth?: boolean | string;
  }

  export interface FastifyRequest {
    auth?: IAnyObject;
  }
}
