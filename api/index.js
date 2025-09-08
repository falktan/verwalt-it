import express from 'express';
import renderEmail from './renderEmail.js';
import { saveSubmission, getSubmissionById } from './dataStore.js';


const router = express.Router();

router.get('/health', function(req, res, next) {
  const result = { status: 'ok', timestamp: new Date() };
  res.json(result);
});

router.post('/submit-form', async function(req, res, next) {
  const formData = req.body;

  const id = await saveSubmission(formData);
  const {subject, body} = renderEmail({formData, token: id});

  res.json({ message: 'Anmeldung erfolgreich abgesendet', email: { to: formData.email, subject, body } });
});

router.post('/get-form-data', async function(req, res, next) {
  const { token } = req.body;

  const formData = await getSubmissionById(token);
  res.json(formData);
});

export default router;
