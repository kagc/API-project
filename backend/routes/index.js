// backend/routes/index.js
const express = require('express');
const router = express.Router();
const apiRouter = require('./api');
// All URLs of the routes in api router will be prefixed with /api
router.use('/api', apiRouter);
// TEST ROUTE
// router.get('/hello/world', function(req, res) {
//   res.cookie('XSRF-TOKEN', req.csrfToken());
//   res.send('Hello World!');
// });

// Add/re-set a XSRF-TOKEN cookie
router.get("/api/csrf/restore", (req, res) => {
    const csrfToken = req.csrfToken();
    res.cookie("XSRF-TOKEN", csrfToken);
    res.status(200).json({
      'XSRF-Token': csrfToken
    });
  });

module.exports = router;