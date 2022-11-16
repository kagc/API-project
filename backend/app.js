// imported packages
const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const routes = require('./routes');
// environment
const { environment } = require('./config');
const isProduction = environment === 'production';
// initialize Express application
const app = express();
// connected morgan middleware for logging req and res info
app.use(morgan('dev'));
// cookie-parser middleware
// express.json middleware for parsing JSON bodies w/ application/json Content-type
app.use(cookieParser());
app.use(express.json());
// Security Middleware
if (!isProduction) {
    // enable cors only in development
    app.use(cors());
  }
  
  // helmet helps set a variety of headers to better secure your app
  app.use(
    helmet.crossOriginResourcePolicy({
      policy: "cross-origin"
    })
  );
  
  // Set the _csrf token and create req.csrfToken method
  app.use(
    csurf({
      cookie: {
        secure: isProduction,
        sameSite: isProduction && "Lax",
        httpOnly: true
      }
    })
  );
// connect all the routes
app.use(routes);


// Export the app
module.exports = app;