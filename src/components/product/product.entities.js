import crypto from 'crypto';

class Product {
  constructor(name, description, price) {
    this.id = crypto.randomBytes(20).toString('hex');
    this.name = name;
    this.description = description;
    this.price = price;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      price: this.price
    };
  }
}

export default Product;