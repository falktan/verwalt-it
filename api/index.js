import express from 'express';
import renderEmail from './emailRenderService.js';
import { saveSubmission, getSubmissionById } from './dataStore/dataStoreService.js';
import { sendMail } from './sendMailService.js';


const router = express.Router();

router.get('/health', function(req, res, next) {
  const result = { status: 'ok', timestamp: new Date() };
  res.json(result);
});

router.post('/submit-form', async function(req, res, next) {
  const formData = req.body;

  const token = await saveSubmission(formData);
  const {email, subject, body} = renderEmail({formData, token});

  await sendMail(email, subject, body);

  res.json({ message: 'Anmeldung erfolgreich abgesendet', email: { email, subject, body } });
});

router.post('/get-form-data', async function(req, res, next) {
  const { token } = req.body;

  const formData = await getSubmissionById(token);
  res.json(formData);
});

export default router;
