import { ArticleModel, UserModel } from '..';
import { filterOutRef } from '../util';

jest.mock('../../internal/mongo/connection.ts', () => ({
  runTransaction: jest.fn(async (callback) => {
    await callback();
  }),
}));

jest.mock('../util.ts', () => ({
  filterOutRef: jest.fn(),
}));

describe('Test User Favorite', () => {
  describe('Test User Favorite Article', () => {
    test('should successfully favorite an article when the user has not favorited it before', async () => {
      const user = new UserModel();
      const article = new ArticleModel();
      user.isFavourited = jest.fn().mockReturnValue(false);
      user.save = jest.fn();
      article.save = jest.fn();

      await user.favorite(article);

      expect(user.isFavourited).toHaveBeenCalledWith(article);
      expect(user.favouritedArticles).toContain(article._id);
      expect(article.favouritedUsers).toContain(user._id);
      expect(user.save).toHaveBeenCalled();
      expect(article.save).toHaveBeenCalled();
    });

    test('Should not make any changes when the user has already favorited the article', async () => {
      const user = new UserModel();
      const article = new ArticleModel();
      user.isFavourited = jest.fn().mockReturnValue(true);
      user.save = jest.fn();
      article.save = jest.fn();

      await user.favorite(article);

      expect(user.isFavourited).toHaveBeenCalledWith(article);
      expect(user.favouritedArticles).not.toContain(article._id);
      expect(article.favouritedUsers).not.toContain(user._id);
      expect(user.save).not.toHaveBeenCalled();
      expect(article.save).not.toHaveBeenCalled();
    });
  });

  describe('Test User UnFavorite Article', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    test('should successfully unfavorite an article when the user has been favorited it before', async () => {
      const user = new UserModel();
      const article = new ArticleModel();
      user.favouritedArticles.push(article._id);
      article.favouritedUsers.push(user._id);
      user.isFavourited = jest.fn().mockReturnValue(true);
      user.save = jest.fn();
      article.save = jest.fn();
      (filterOutRef as jest.Mock).mockReturnValue([]);

      await user.unFavorite(article);

      expect(user.isFavourited).toHaveBeenCalledWith(article);
      expect(user.favouritedArticles).not.toContain(article._id);
      expect(article.favouritedUsers).not.toContain(user._id);
      expect(filterOutRef).toHaveBeenCalledTimes(2);
      expect(user.save).toHaveBeenCalled();
      expect(article.save).toHaveBeenCalled();
    });

    test('Should not make any changes when the user has not favorited that article', async () => {
      const user = new UserModel();
      const article = new ArticleModel();
      user.isFavourited = jest.fn().mockReturnValue(false);
      user.save = jest.fn();
      article.save = jest.fn();

      await user.unFavorite(article);

      expect(user.isFavourited).toHaveBeenCalledWith(article);
      expect(filterOutRef).not.toHaveBeenCalled();
      expect(user.save).not.toHaveBeenCalled();
      expect(article.save).not.toHaveBeenCalled();
    });
  });

  describe('Test isFavourited', () => {
    test('should return true when user already favourite that article', () => {
      const user = new UserModel();
      const article = new ArticleModel();
      user.favouritedArticles.push(article._id);
      article.favouritedUsers.push(user._id);

      const result = user.isFavourited(article);

      expect(result).toEqual(true);
    });

    test('should return false when user not yet favourite that article', () => {
      const user = new UserModel();
      const article = new ArticleModel();

      const result = user.isFavourited(article);

      expect(result).toEqual(false);
    });
  });
});
