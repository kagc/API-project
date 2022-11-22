// backend/routes/api/users.js
const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSignup = [
  check('email')
  .exists({ checkFalsy: true })
  .isEmail()
  .withMessage('Invalid email'),
check('username')
  .exists({ checkFalsy: true })
  .isLength({ min: 4 })
  .withMessage('Username is required'),
check('username')
  .not()
  .isEmail()
  .withMessage('Username cannot be an email.'),
check('password')
  .exists({ checkFalsy: true })
  .isLength({ min: 6 })
  .withMessage('Password must be 6 characters or more.'),
  check('firstName')
  .exists({ checkFalsy: true })
  .withMessage('First Name is required'),
  check('lastName')
  .exists({ checkFalsy: true })
  .withMessage('Last Name is required'),
    handleValidationErrors
  ];

// Sign up
router.post(
    '/',
    validateSignup,
    async (req, res) => {
      try
      {
        const { email, password, username, firstName, lastName } = req.body;
      const user = await User.signup({ firstName, lastName, email, username, password });
  
      let token = await setTokenCookie(res, user);
  
      return res.json({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        token: token
      });
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        error.status = 403
        return res.json({
          message: "User already exists",
          statusCode: error.status,
          errors: {
            email: "User with that email already exists"
          }
        })
      }
    }
    }
  );
 
module.exports = router;