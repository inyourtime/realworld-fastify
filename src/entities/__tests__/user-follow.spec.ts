import { UserModel } from '..';
import { filterOutRef } from '../util';

jest.mock('../../internal/mongo/connection.ts', () => ({
  runTransaction: jest.fn(async (callback) => {
    await callback();
  }),
}));

jest.mock('../util.ts', () => ({
  filterOutRef: jest.fn(),
}));

describe('Test User Following', () => {
  describe('Test follow', () => {
    // User follows another user successfully
    it('should follow another user successfully', async () => {
      // Arrange
      const user1 = new UserModel();
      const user2 = new UserModel();
      user1.isFollowing = jest.fn().mockReturnValue(false);
      user1.save = jest.fn();
      user2.save = jest.fn();

      // Act
      await user1.follow(user2);

      // Assert
      expect(user1.isFollowing).toHaveBeenCalledWith(user2);
      expect(user1.followings).toContain(user2._id);
      expect(user2.followers).toContain(user1._id);
      expect(user1.save).toHaveBeenCalled();
      expect(user2.save).toHaveBeenCalled();
    });

    // User tries to follow a user they are already following, no changes occur
    it('should not follow a user they are already following', async () => {
      // Arrange
      const user1 = new UserModel();
      const user2 = new UserModel();
      user1.isFollowing = jest.fn().mockReturnValue(true);
      user1.save = jest.fn();
      user2.save = jest.fn();

      // Act
      await user1.follow(user2);

      // Assert
      expect(user1.isFollowing).toHaveBeenCalledWith(user2);
      expect(user1.followings).not.toContain(user2._id);
      expect(user2.followers).not.toContain(user1._id);
      expect(user1.save).not.toHaveBeenCalled();
      expect(user2.save).not.toHaveBeenCalled();
    });

    // User tries to follow themselves, no changes occur
    it('should not follow themselves', async () => {
      // Arrange
      const user1 = new UserModel();
      user1.isFollowing = jest.fn().mockReturnValue(false);
      user1.save = jest.fn();

      // Act
      await user1.follow(user1);

      // Assert
      expect(user1.isFollowing).toHaveBeenCalledWith(user1);
      expect(user1.followings).not.toContain(user1._id);
      expect(user1.save).not.toHaveBeenCalled();
    });
  });

  describe('Test unfollow', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should unfollow another user successfully', async () => {
      const user1 = new UserModel();
      const user2 = new UserModel();
      user1.followings.push(user2._id);
      user2.followers.push(user1._id);
      user1.isFollowing = jest.fn().mockReturnValue(true);
      user1.save = jest.fn();
      user2.save = jest.fn();
      (filterOutRef as jest.Mock).mockReturnValue([]);

      // Act
      await user1.unFollow(user2);

      // Assert
      expect(user1.isFollowing).toHaveBeenCalledWith(user2);
      expect(user1.followings).not.toContain(user2._id);
      expect(user2.followers).not.toContain(user1._id);
      expect(filterOutRef).toHaveBeenCalledTimes(2);
      expect(user1.save).toHaveBeenCalled();
      expect(user2.save).toHaveBeenCalled();
    });

    it('should not unfollow a user they are not follower', async () => {
      // Arrange
      const user1 = new UserModel();
      const user2 = new UserModel();
      user1.isFollowing = jest.fn().mockReturnValue(false);
      user1.save = jest.fn();
      user2.save = jest.fn();

      // Act
      await user1.unFollow(user2);

      // Assert
      expect(user1.isFollowing).toHaveBeenCalledWith(user2);
      expect(filterOutRef).not.toHaveBeenCalled();
      expect(user1.save).not.toHaveBeenCalled();
      expect(user2.save).not.toHaveBeenCalled();
    });

    it('should not unfollow themselves', async () => {
      // Arrange
      const user1 = new UserModel();
      user1.isFollowing = jest.fn().mockReturnValue(false);
      user1.save = jest.fn();

      // Act
      await user1.unFollow(user1);

      // Assert
      expect(user1.isFollowing).toHaveBeenCalledWith(user1);
      expect(filterOutRef).not.toHaveBeenCalled();
      expect(user1.save).not.toHaveBeenCalled();
    });
  });
});
