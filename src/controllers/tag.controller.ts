import { IAnyObject } from '../declarations/interfaces/base.interface';
import { ArticleModel } from '../entities';
import BaseController from './base.controller';

export default class TagContrtoller extends BaseController {
  constructor(auth?: IAnyObject) {
    super(auth);
  }

  public async getTags(): Promise<{ tags: string[] }> {
    return {
      tags: await ArticleModel.find({}).distinct('tagList').exec(),
    };
  }
}
