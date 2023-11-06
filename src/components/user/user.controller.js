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
      } else {
         const errors = [];

         const stringValidator = new StringValidator(req.body.password);
         if (!stringValidator.isValid()) {
           errors.push('password should be string value and minum length of 6');
         }

         const integerValidator = new IntegerValidator(req.body.age);
         if (!integerValidator.isValid()) {
          
           errors.push('age should be integer value');
         }

         const mainThis = this;
         const emailValidator = new EmailValidator(req.body.email);

         emailValidator.isValid().then(async function (result) {
           if (result.valid === false) {
             errors.push('email is not valid');
           }

           if (errors.length > 0) {
             return res.status(400).json({errors: errors});
           }

           return await mainThis.createDbUserAndModel(req, res);
         });
       }
    });
  };

  getUsers = (_, res) => this.getAllDbUsers(res);

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

  createDbUserAndModel = async (req, response) => {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      db.query('INSERT INTO users SET?', {
            email: req.body.email,
            password: hashedPassword,
            age: req.body.age
        }, (error, res) => {
            if (error) {
                console.log(error);
            }
            if (res.insertId) {
                const user = new User()
                    .setId(res.insertId)
                    .setEmail(req.body.email)
                    .setPassword(hashedPassword)
                    .setAge(req.body.age);

                return response.status(201).send(user);
            }
        })
    };

    getAllDbUsers = async (res) => {
        db.query('SELECT id, email, age  FROM users ORDER BY id DESC', async (error, result) => {
            return  res.status(200).send(result);
        });
    };
}

export default UserController;