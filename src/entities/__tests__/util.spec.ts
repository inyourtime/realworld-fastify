import { ArticleModel, UserModel } from '..';
import { filterOutRef } from '../util';

describe('Test filterOutRef function', () => {
  it('should return a filtered array when given an array with the ref', () => {
    const user = new UserModel();
    const article = new ArticleModel();
    user.favouritedArticles.push(article);
    article.favouritedUsers.push(user);

    const filteredUser = filterOutRef(user.favouritedArticles, article);
    const filteredArticle = filterOutRef(article.favouritedUsers, user);
    expect(filteredUser).toEqual([]);
    expect(filteredArticle).toEqual([]);
  });

  it('should return a filtered array when given an array with the ObjectId', () => {
    const user = new UserModel();
    const article = new ArticleModel();
    user.favouritedArticles.push(article._id);
    article.favouritedUsers.push(user._id);

    const filteredUser = filterOutRef(user.favouritedArticles, article);
    const filteredArticle = filterOutRef(article.favouritedUsers, user);
    expect(filteredUser).toEqual([]);
    expect(filteredArticle).toEqual([]);
  });

  it('should return a filtered array when given an array with the ref and out is ObjectId', () => {
    const user = new UserModel();
    const article = new ArticleModel();
    user.favouritedArticles.push(article);
    article.favouritedUsers.push(user);

    const filteredUser = filterOutRef(user.favouritedArticles, article._id);
    const filteredArticle = filterOutRef(article.favouritedUsers, user._id);
    expect(filteredUser).toEqual([]);
    expect(filteredArticle).toEqual([]);
  });
});
