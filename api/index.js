import express from 'express';
import { fetchSubmission, handleCreate, handleConfirm, handleUpdate, handleUpdateConfirmations, handlePruefungsausschussApproval } from './formService.js';
import { requireAccessToken, requireRole } from './utils/permissionHelper.js';


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

router.post('/fetch-submission', requireAccessToken, async function(req, res, next) {
  const { accessToken } = req.body;
  const submissionData = await fetchSubmission({accessToken});
  res.json(submissionData);
});

router.post('/confirm-submission',
  requireRole(['pruefungsamt','betreuer_betrieblich', 'betreuer_hochschule', 'betreuer_korreferent']),
  async function(req, res, next) {

  const { accessToken } = req.body;
  await handleConfirm({accessToken});
  res.json({ message: 'Submission confirmed successfully' });
});

router.post('/update-submission', requireRole(['pruefungsamt']), async function(req, res, next) {
  const { formData, accessToken } = req.body;
  await handleUpdate({formData, accessToken});
  res.json({ message: 'Submission updated successfully' });
});

router.post('/update-confirmations', requireRole(['pruefungsamt']), async function(req, res, next) {
  const { confirmations, accessToken } = req.body;
  await handleUpdateConfirmations({confirmations, accessToken});
  res.json({ message: 'Confirmations updated successfully' });
});

router.post('/approve-submission', requireRole(['pruefungsausschuss']), async function(req, res, next) {
  const { accessToken } = req.body;
  await handlePruefungsausschussApproval({accessToken});
  res.json({ message: 'Submission approved and notification emails sent successfully' });
});


export default router;
