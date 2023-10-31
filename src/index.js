import app from './app.js';
import userModule from './components/user/user.module.js';
import productModule from './components/product/product.module.js';
import { body, validationResult } from 'express-validator';

app.listen(4000, () => {
  console.log('Server listening...');
});

app.use('/users', userModule.router);
app.use('/products', productModule.router);


app.post("/users", 
  body('email').isEmail().withMessage("Email is not valid"),
 (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
});

app.post("/auth/register", 
  body('email').isEmail().withMessage("Email is not valid"),
//  check(req.body.email, 'Email length should be 10 to 30 characters').isEmail().isLength({ min: 10, max: 30 })
 (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
    return res.status(200).send(req.body);
    // db.query() code goes here
});