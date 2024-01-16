import { IAnyObject } from '../declarations/interfaces/base.interface';

export default abstract class BaseController {
  protected auth: IAnyObject | undefined;

  constructor(auth?: IAnyObject) {
    this.auth = auth;
  }
}
