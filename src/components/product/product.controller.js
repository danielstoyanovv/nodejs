import Product from './product.entities.js';
import StringValidator from '../validator/string.validator.js';
import NumberValidator from '../validator/number.validator.js';

class ProductController {
  constructor(productService) {
    this.productService = productService;
  }

  createProduct = (req, res) => {
    const errors = [];

    const stringValidator = new StringValidator(req.body.name);
    if (!stringValidator.isValid()) {
      errors.push('name should be string value and minum length of 6');
    }

    const stringValidatorDescription = new StringValidator(req.body.description);
    if (!stringValidatorDescription.isValid()) {
      errors.push('description should be string value and minum length of 6');
    }

    const numberValidator = new NumberValidator(req.body.price);
    if (!numberValidator.isValid()) {
      errors.push('price should be number format');
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors: errors });
    }

    const product = new Product(req.body.name, req.body.description, req.body.price);
    return res.status(201).send(this.productService.createProduct(product));
  };

  getProducts = (_, res) => res.status(200).send(this.productService.getProducts());

  getProduct = (req, res) => {
    const { id } = req.params;
    return res.status(200).send(this.productService.getProduct(id));
  };

}

export default ProductController;