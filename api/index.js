import express from 'express';
import { fetchSubmission, handleCreate, handleConfirm, handleUpdate, handleUpdateConfirmations } from './formService.js';
import { decodeAccessToken } from './utils/token.js';


const router = express.Router();

// Helper function to require a valid access token
function requireAccessToken(req, res, next) {
  try {
    const { accessToken } = req.body;
    
    if (!accessToken) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const { userRole } = decodeAccessToken(accessToken);
    
    if (!userRole) {
      return res.status(401).json({ error: 'Invalid access token' });
    }

    // Add user role to request for use in handlers
    req.userRole = userRole;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid access token' });
  }
}

// Helper function to check if user has one of the roles
function requireRole(permittedRoles) {
  return (req, res, next) => {
    requireAccessToken(req, res, () => {
      const userRole = req.userRole;  // set in requireAccessToken

      if (!permittedRoles.includes(userRole)) {
        return res.status(403).json({ 
          error: 'Insufficient permissions', 
          required: permittedRoles,
          current: userRole 
        });
      }
      next();
    });
  };
}

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


export default router;
