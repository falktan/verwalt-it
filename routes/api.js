var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  const result = { message: 'API is working' };
  res.json(result);
  // res.send();
});

module.exports = router;
