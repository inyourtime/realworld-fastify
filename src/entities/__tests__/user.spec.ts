// import { Types } from 'mongoose';
import { UserModel } from '..';

describe('Test user model method', () => {
  it('should return user json', async () => {
    const user = new UserModel();
    user.email = 'test@example.com';
    user.username = 'testuser';
    user.password = 'testpassword';
    user.bio = 'Test bio';
    user.image = 'test.jpg';

    const result = await user.toUserJSON();

    expect(result).toEqual({
      email: 'test@example.com',
      token: expect.any(String),
      username: 'testuser',
      bio: 'Test bio',
      // image: 'test.jpg',
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

  it('Test isFollowing should return false when is same user', () => {
    const user = new UserModel();

    const result = user.isFollowing(user);

    expect(result).toEqual(false);
  });
});
