import UserController from './user.controller.js';
import UserRouter from './user.router.js';

const userController = new UserController();
const userRouter = new UserRouter(userController);

export default {
    controller: userController,
    router: userRouter.getRouter(),
};