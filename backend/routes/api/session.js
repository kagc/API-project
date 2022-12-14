// backend/routes/api/session.js
const express = require('express')

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateLogin = [
  check('credential')
  // .withMessage("Email or username is required"),
  // check('credential')
  .exists({ checkFalsy: true })
  // .notEmpty()
  .withMessage("Email or username is required"),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage("Password is required"),
  handleValidationErrors
];

// Log in
router.post(
    '/',
    validateLogin,
    async (req, res, next) => {
      const { credential, password } = req.body;
  
      const user = await User.login({ credential, password });
  
      if (!user) {
        const err = new Error('Login failed');
        err.status = 401;
        err.title = 'Invalid credentials';
        err.errors = ['The provided credentials were invalid.'];
        return next(err);
      }
  
      let token = await setTokenCookie(res, user);
  
      return res.json({
        user: user.toSafeObject()
        // id: user.id,
        // firstName: user.firstName,
        // lastName: user.lastName,
        // email: user.email,
        // username: user.username,
        // token: token
      });
    
    }
  );

  // Log out
router.delete(
    '/',
    (_req, res) => {
      res.clearCookie('token');
      return res.json({ message: 'success' });
    }
  );
  
// Restore session user
router.get(
  '/',
  restoreUser,
  (req, res) => {
    const { user } = req;
    if (user) {
      return res.json({
        user: user.toSafeObject()
      });
    // } else return res.status(401).json({
    } else return res.json({
      user: null
    //   message: "Unauthorized",
    // statusCode: 401,
    // errors: [
    //     "Unauthorized"
    // ]
    });
  }
);


module.exports = router;