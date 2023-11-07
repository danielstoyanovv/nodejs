import ProductController from './product.controller.js';
import ProductRouter from './product.router.js';

const productController = new ProductController();
const productRouter = new ProductRouter(productController);

export default {
  controller: productController,
  router: productRouter.getRouter(),
};