export default class ApiError extends Error {
  constructor(public message: string, public statusCode: number) {
    super(message);
  }

  static createError(message: string, statusCode: number) {
    return new ApiError(message, statusCode);
  }
}
