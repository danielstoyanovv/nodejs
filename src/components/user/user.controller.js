import User from './user.entities.js';
import EmailValidator from '../validator/email.validator.js';
import IntegerValidator from '../validator/integer.validator.js';
import StringValidator from '../validator/string.validator.js';

class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  createUser = (req, res) => {
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

    emailValidator.isValid().then(function (result) {
      if (result.valid === false) {
          errors.push('email is not valid');
      }

      if (errors.length > 0) {
          return res.status(400).json({ errors: errors });
      }
      
      const user = new User(req.body.email, req.body.password, req.body.age);
      return res.status(201).send(mainThis.userService.addUser(user));
    });
  };

  getUsers = (_, res) => res.status(200).send(this.userService.getUsers());

  getUser = (req, res) => {
    const { id } = req.params;
    return res.status(200).send(this.userService.getUser(id));
  };
}

export default UserController;