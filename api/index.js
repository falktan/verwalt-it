import express from 'express';
import renderEmail from './renderEmail.js';

const router = express.Router();

router.get('/', function(req, res, next) {
  const result = { message: 'API is working' };
  res.json(result);
});

router.post('/submit-form', function(req, res, next) {
  const formData = req.body;

  const {subject, body} = renderEmail(formData);

  res.json({ message: 'Anmeldung erfolgreich abgesendet', email: { to: formData.email, subject, body } });
});

export default router;
