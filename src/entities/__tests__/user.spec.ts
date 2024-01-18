// import { Types } from 'mongoose';
import { UserModel } from '..';

describe('Test user model method', () => {
  it('should return user json', () => {
    const user = new UserModel();
    user.email = 'test@example.com';
    user.username = 'testuser';
    user.password = 'testpassword';
    user.bio = 'Test bio';
    user.image = 'test.jpg';

    const result = user.toUserJSON();

    expect(result).toEqual({
      email: 'test@example.com',
      token: expect.any(String),
      username: 'testuser',
      bio: 'Test bio',
      image: 'test.jpg',
      password: undefined,
    });
  });

  it('should return a valid profile object with all fields', () => {
    const user = new UserModel();
    user.username = 'testUser';
    user.bio = 'testBio';
    user.image = 'testImage';
    const userProfile = user.toProfileJSON();
    expect(userProfile).toEqual({
      username: 'testUser',
      bio: 'testBio',
      image: 'testImage',
      following: false,
    });
  });

  it('should set following field to true when user parameter is provided and current user is following the user', () => {
    const user = new UserModel();
    user.username = 'testUser';
    user.bio = 'testBio';
    user.image = 'testImage';
    const currentUser = new UserModel();
    currentUser.followings = [user._id];
    const userProfileResp = user.toProfileJSON(currentUser);
    expect(userProfileResp.following).toBe(true);
  });

  // it('should return true when the user is not already following the given user and the email of the two users are different', () => {
  //   const user = new UserModel();
  //   user.followings = [];
  //   user.email = 'user1@example.com';
  //   const givenUser = new UserModel();
  //   givenUser._id = new Types.ObjectId('5e997f95d6a35f3a0def3339');
  //   givenUser.email = 'user2@example.com';

  //   const result = user.canFollow(givenUser);

  //   expect(result).toBe(true);
  // });

  // it('should return false when the user is already following the given user', () => {
  //   const user = new UserModel();
  //   user.followings = [new Types.ObjectId('5e997f95d6a35f3a0def3339')];
  //   const givenUser = new UserModel();
  //   givenUser._id = new Types.ObjectId('5e997f95d6a35f3a0def3339');

  //   const result = user.canFollow(givenUser);

  //   expect(result).toBe(false);
  // });

  // it('should return false when the email of the two users are the same', () => {
  //   const user = new UserModel();
  //   user.email = 'user@example.com';
  //   const givenUser = new UserModel();
  //   givenUser.email = 'user@example.com';

  //   const result = user.canFollow(givenUser);

  //   expect(result).toBe(false);
  // });

  // it('should return true when the user is following the given user and can be unfollowed', () => {
  //   const currentUser = new UserModel();
  //   currentUser.email = 'user1@example.com';
  //   const givenUser = new UserModel();
  //   givenUser.email = 'user2@example.com';
  //   currentUser.followings = [givenUser._id];

  //   const result = currentUser.canUnFollow(givenUser);

  //   expect(result).toBe(true);
  // });

  // it('should return false when the user is not following the given user and cannot be unfollowed', () => {
  //   const currentUser = new UserModel();
  //   const givenUser = new UserModel();

  //   const result = currentUser.canUnFollow(givenUser);

  //   expect(result).toBe(false);
  // });

  // it('should return false when the given user is the same as the current user', () => {
  //   const currentUser = new UserModel();
  //   currentUser.email = 'test@example.com';
  //   const givenUser = new UserModel();
  //   givenUser.email = 'test@example.com';

  //   const result = currentUser.canUnFollow(givenUser);

  //   expect(result).toBe(false);
  // });
});
