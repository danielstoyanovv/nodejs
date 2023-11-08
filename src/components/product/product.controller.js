import Product from './product.entities.js';
import StringValidator from '../validator/string.validator.js';
import NumberValidator from '../validator/number.validator.js';
import db from "../../database/mysql/db.js";
import mysql from "mysql";

class ProductController {
    createProduct = (req, res) => {
        const errors = this.processValidators(req);
        if (errors.length > 0) {
            return res.status(400).json({ errors: errors });
        }
        return this.createNewItem(req, res);
    };

    updateProduct = async (req, res) => {
        const {id} = req.params;
        const sqlSearch = "SELECT id FROM products WHERE id = ?";
        const searchQuery = mysql.format(sqlSearch, [id]);
        await db.query(searchQuery, async (error, result) => {
            if (result.length === 0) {
                return res.status(404).json({errors: ['product not found']});
            }
            const errors = this.processValidators(req);
            if (errors.length > 0) {
                return res.status(400).json({ errors: errors });
            }
            const name = req.body.name;
            const description = req.body.description;
            const price = req.body.price;
            const sqlUpdate = "UPDATE products set name = ?, description = ?, price = ? WHERE id = ?";
            const updateQuery = mysql.format(sqlUpdate, [name, description, price, id]);
            await db.query(updateQuery, async (error, result) => {
                if (result) {
                    let item = {id: id, name: name, description: description, price: price};
                    return res.status(200).send(item);
                }
            });
        });
    };

    getProducts = (_, res) => this.getItems(res);

    getProduct = async (req, res) => {
        const {id} = req.params;
        const sqlSearch = "SELECT id, name, description, price FROM products WHERE id = ?";
        const searchQuery = mysql.format(sqlSearch, [id]);
        await db.query(searchQuery, async (error, result) => {
            if (result.length > 0) {
                return res.status(200).send(result);
            }
            return res.status(404).json({errors: ['product not found']});
        });
    };

    createNewItem = async (req, response) => {
        const name = req.body.name;
        const description = req.body.description;
        const price = req.body.price;
        db.query('INSERT INTO products SET?', {
            name: name,
            description: description,
            price : price
        }, (error, res) => {
            if (error) {
                console.log(error);
            }
            if (res.insertId) {
                const product = new Product()
                    .setId(res.insertId)
                    .setName(name)
                    .setDescription(description)
                    .setPrice(price);
                return response.status(201).send(product);
            }
        })
    };

    getItems = async (res) => {
        db.query('SELECT id, name, description, price  FROM products ORDER BY id DESC', async (error, result) => {
            return  res.status(200).send(result);
        });
    };

    processValidators = (req) => {
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
        return errors;
    };
}

export default ProductController;