import express from 'express';
import { fetchSubmission, handleCreate, handleConfirm, handleUpdate, handleUpdateConfirmations } from './formService.js';


const router = express.Router();

router.get('/health', function(req, res, next) {
  const result = { status: 'ok', timestamp: new Date() };
  res.json(result);
});

router.post('/create-submission', async function(req, res, next) {
  const { formData } = req.body;
  await handleCreate({formData});
  res.json({ message: 'Submission created successfully' });
});

router.post('/fetch-submission', async function(req, res, next) {
  const { accessToken } = req.body;
  const submissionData = await fetchSubmission({accessToken});
  res.json(submissionData);
});

router.post('/confirm-submission', async function(req, res, next) {
  const { accessToken } = req.body;
  await handleConfirm({accessToken});
  res.json({ message: 'Submission confirmed successfully' });
});

router.post('/update-submission', async function(req, res, next) {
  const { formData, accessToken } = req.body;
  await handleUpdate({formData, accessToken});
  res.json({ message: 'Submission updated successfully' });
});

router.post('/update-confirmations', async function(req, res, next) {
  const { confirmations, accessToken } = req.body;
  await handleUpdateConfirmations({confirmations, accessToken});
  res.json({ message: 'Confirmations updated successfully' });
});


export default router;
