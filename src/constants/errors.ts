import ApiError from '../internal/fastify/responseHandler/apiError';
import { STATUS_CODE } from '../internal/fastify/responseHandler/statusCode';

// prettier-ignore
export default {
  USER_NOTFOUND: ApiError.createError(`User Not Found`, STATUS_CODE.NOT_FOUND),
  PROFILE_NOTFOUND: ApiError.createError(`Profile Not Found`, STATUS_CODE.NOT_FOUND),
  USER_EXIST: ApiError.createError(`Email or username are already exist`, STATUS_CODE.UNPROCESSABLE_CONTENT),
  LOGIN_ERROR: ApiError.createError(`Email or password are incorrect`, STATUS_CODE.UNAUTHORIZED),
  ARTICLE_EXIST: ApiError.createError(`Article slug are already exist`, STATUS_CODE.UNPROCESSABLE_CONTENT),
  ARTICLE_NOTFOUND: ApiError.createError(`Article Not Found`, STATUS_CODE.NOT_FOUND),
};
