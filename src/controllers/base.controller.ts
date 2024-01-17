import { IAnyObject } from '../declarations/interfaces/base.interface';

export default abstract class BaseController {
  protected auth: IAnyObject | undefined;

  constructor(auth?: IAnyObject) {
    this.auth = auth;
  }

  protected getUserId(): string {
    return this.auth!.user.id;
  }

  protected getUserEmail(): string {
    return this.auth!.user.email;
  }
}
