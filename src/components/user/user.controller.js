import User from './user.entities.js';
import EmailValidator from '../validator/email.validator.js';
import IntegerValidator from '../validator/integer.validator.js';
import StringValidator from '../validator/string.validator.js';
import db from "../../database/mysql/db.js";
import mysql from "mysql";
import bcrypt, {compareSync} from "bcrypt";

class UserController {
    createUser = async (req, res) => {
        const sqlSearch = "SELECT email FROM users WHERE email = ?";
        const searchQuery = mysql.format(sqlSearch, [req.body.email]);
        await db.query(searchQuery, async (error, result) => {
            if (result.length > 0) {
                return res.status(409).json({errors: ['user already exists']});
            }
            const errors = this.processValidators(req);
            const mainThis = this;
            const emailValidator = new EmailValidator(req.body.email);
            emailValidator.isValid().then(async function (result) {
                if (result.valid === false) {
                    errors.push('email is not valid');
                }
                if (errors.length > 0) {
                    return res.status(400).json({errors: errors});
                }
                return await mainThis.createNewItem(req, res);
            });
        });
    };

    updateUser = async (req, res) => {
        const errors = this.processValidators(req);
        if (errors.length > 0) {
            return res.status(400).json({ errors: errors });
        }
        const email = req.body.email;
        const emailValidator = new EmailValidator(email);
        emailValidator.isValid().then(async function (result) {
            if (result.valid === false) {
                errors.push('email is not valid');
            }
            if (errors.length > 0) {
                return res.status(400).json({errors: errors});
            }
            const {id} = req.params;
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const age = req.body.age;
            const sqlUpdate = "UPDATE users set email = ?, password = ?, age = ? WHERE id = ?";
            const updateQuery = mysql.format(sqlUpdate, [email, hashedPassword, age, id]);
            await db.query(updateQuery, async (error, result) => {
                if (result) {
                    let item = {id: id, email: email, password: hashedPassword, age: age};
                    return res.status(200).send(item);
                }
            });
        });
    };

    getUsers = (_, res) => this.getItems(res);

    getUser = async (req, res) => {
        const {id} = req.params;
        const sqlSearch = "SELECT id, email, age FROM users WHERE id = ?";
        const searchQuery = mysql.format(sqlSearch, [id]);
        await db.query(searchQuery, async (error, result) => {
            if (result.length > 0) {
                return res.status(200).send(result);
            }
            return res.status(404).json({errors: ['user not found']});
        });
    };

    createNewItem = async (req, response) => {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const email = req.body.email;
        const age = req.body.age;

        db.query('INSERT INTO users SET?', {
            email: email,
            password: hashedPassword,
            age: age
        }, (error, res) => {
            if (error) {
                console.log(error);
            }
            if (res.insertId) {
                const user = new User()
                    .setId(res.insertId)
                    .setEmail(email)
                    .setPassword(hashedPassword)
                    .setAge(age);
                return response.status(201).send(user);
            }
        })
    };

    getItems = async (res) => {
        db.query('SELECT id, email, age  FROM users ORDER BY id DESC', async (error, result) => {
            return  res.status(200).send(result);
        });
    };

    processValidators = (req) => {
        const errors = [];
        const stringValidator = new StringValidator(req.body.password);
        if (!stringValidator.isValid()) {
            errors.push('password should be string value and minum length of 6');
        }
        const integerValidator = new IntegerValidator(req.body.age);
        if (!integerValidator.isValid()) {
            errors.push('age should be integer value');
        }
        return errors;
    };
}

export default UserController;