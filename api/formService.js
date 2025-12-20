import { storeNewSubmission, confirmSubmission, updateSubmission, getSubmission, updateConfirmations } from './dataStore/dataStoreService.js';
import { decodeAccessToken, createSecret, encryptData } from './utils/token.js';
import { renderEmailsNewSubmission, renderEmailAllConfirmationsComplete, renderEmailPruefungsausschussApproval } from './emailRenderService.js';
import { sendMail } from './sendMailService.js';


export async function fetchSubmission({accessToken}) {
    const {userRole} = decodeAccessToken(accessToken);
    return {...await getSubmission(accessToken), userRole};
}

export async function handleCreate({formData}) {
    const submissionId = createSubmissionId();
    await storeNewSubmission({submissionId, formData});
    await sendEmailsNewSubmission({formData, submissionId});
}

export async function handleConfirm({accessToken}) {
    const {submissionId, userRole} = decodeAccessToken(accessToken);

    await confirmSubmission({submissionId, userRole});
    await checkAndHandleCompletion(accessToken);
}

export async function handleUpdate({formData, accessToken}) {
    const {submissionId} = decodeAccessToken(accessToken);

    await updateSubmission({submissionId, formData});
}

export async function handleUpdateConfirmations({confirmations, accessToken}) {
    const {submissionId} = decodeAccessToken(accessToken);
    await updateConfirmations({submissionId, confirmations});
    await checkAndHandleCompletion(accessToken);
}

export async function handlePruefungsausschussApproval({accessToken}) {
    const {submissionId} = decodeAccessToken(accessToken);
    const submission = await getSubmission(accessToken);
    
    await sendEmailPruefungsausschussApproval({formData: submission.formData, submissionId});
}

async function sendEmailsNewSubmission({formData, submissionId}) {
    await Promise.all(renderEmailsNewSubmission({formData, submissionId}).map(email => sendMail(email)));
}

async function sendEmailPruefungsausschussApproval({formData}) {
    const email = renderEmailPruefungsausschussApproval({formData});
    await sendMail(email);
}

function createSubmissionId() {
    return createSecret();
}

async function checkAndHandleCompletion(accessToken) {
    const requiredConfirmations = ['betreuer_hochschule', 'korreferent', 'pruefungsamt'];

    const submission = await getSubmission(accessToken)
    const confirmations = submission.confirmations;

    const allConfirmed = requiredConfirmations.every(role => confirmations[role] === true);

    if (allConfirmed) {
        await handleAllConfirmationsComplete(accessToken);
    }
}

async function handleAllConfirmationsComplete(accessToken) {
    console.log(`Alle Bestätigungen sind eingegangen`);
    
    const submission = await getSubmission(accessToken);
    const {submissionId} = decodeAccessToken(accessToken);
    const email = renderEmailAllConfirmationsComplete({formData: submission.formData, submissionId});
    await sendMail(email);
}
  