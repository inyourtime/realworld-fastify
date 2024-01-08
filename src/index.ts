import FastifyServer from './internal/fastify';
import cors from '@fastify/cors';
import MongoConnect from './internal/mongo/connection';
import UserModel from './entities/User.Entity';
import UserService from './services/User.Service';
import dotenv from 'dotenv';

(async () => {
  dotenv.config();

  const serverInstance = FastifyServer.getInstance();
  const f = serverInstance.getServer();

  serverInstance.addPlugin(cors, {});

  f.get('/', async (req, reply) => {
    reply.send('hello');
  });

  try {
    await Promise.all([MongoConnect(), serverInstance.start()]);

    // const user1 = await UserModel.create({ name: 'boat' });
    // const user2 = await UserModel.create({ name: 'beam' });
    // const user3 = await UserModel.create({ name: 'big', followers: [user1, user2] });
    // console.log(_id)
    // const user = await UserModel.findOne({ name: 'big' }).populate('followers').lean().exec();
    // await user?.populate('followers')
    const userService = new UserService();
    const users = await userService.findAll();
    console.log(users);
  } catch (e) {
    console.error('Error starting server:', e);
  }
})();
