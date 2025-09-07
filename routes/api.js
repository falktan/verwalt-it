var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  const result = { message: 'API is working' };
  res.json(result);
});

router.post('/submit-form', function(req, res, next) {
  const formData = req.body;
  // Process the form data as needed
  res.json({ message: 'Form submitted successfully', data: formData });
});

module.exports = router;
