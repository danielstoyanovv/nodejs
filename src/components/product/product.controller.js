import Product from './product.entities.js';

class ProductController {
  constructor(productService) {
    this.productService = productService;
  }

  createProduct = (req, res) => {
    const product = new Product(req.body.name, req.body.description, req.body.price);
    return res.status(201).send(this.productService.createProduct(product));
  };

  getProducts = (_, res) => res.status(200).send(this.productService.getProducts());

  getProduct = (req, res) => {
    const { id } = req.params;
    return res.status(200).send(this.productService.getProduct(id));
  };

  //getUser = (req, res) => {
    // const { id } = req.params;
    // return res.status(200).send(this.userService.getUser(id));
  // };

}

export default ProductController;