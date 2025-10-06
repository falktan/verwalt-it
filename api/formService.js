import { storeNewSubmission, confirmSubmission, updateSubmission, getSubmission, updateConfirmations } from './dataStore/dataStoreService.js';
import { decodeAccessToken, createSecret, encryptData } from './utils/token.js';
import { renderEmailsNewSubmission } from './emailRenderService.js';
import { sendMail } from './sendMailService.js';


export async function fetchSubmission({accessToken}) {
    const {userRole} = decodeAccessToken(accessToken);
    return {...await getSubmission(accessToken), userRole};
}

export async function handleCreate({formData}) {
    const secrets = createSecrets();
    const encryptedFormData = encryptData(formData, secrets.formEncryptionSecret);
    await storeNewSubmission({submissionId: secrets.submissionId, encryptedFormData});
    await sendEmailsNewSubmission({formData, secrets});
}

export async function handleConfirm({accessToken}) {
    const {submissionId, userRole} = decodeAccessToken(accessToken);

    await confirmSubmission({submissionId, userRole});
    await checkAndHandleCompletion(accessToken);
}

export async function handleUpdate({formData, accessToken}) {
    const {submissionId, formEncryptionSecret} = decodeAccessToken(accessToken);
    const encryptedFormData = encryptData(formData, formEncryptionSecret);

    await updateSubmission({submissionId, encryptedFormData});
}

export async function handleUpdateConfirmations({confirmations, accessToken}) {
    const {submissionId} = decodeAccessToken(accessToken);
    await updateConfirmations({submissionId, confirmations});
    await checkAndHandleCompletion(accessToken);
}

async function sendEmailsNewSubmission({formData, secrets}) {
    await Promise.all(renderEmailsNewSubmission({formData, secrets}).map(email => sendMail(email)));
}

function createSecrets() {
    return {
        formEncryptionSecret: createSecret(),
        submissionId: createSecret()
    }
}

async function checkAndHandleCompletion(accessToken) {
    const requiredConfirmations = ['betreuer_betrieblich', 'betreuer_hochschule', 'betreuer_korreferent', 'pruefungsamt'];

    const submission = await getSubmission(accessToken)
    const confirmations = submission.confirmations;

    const allConfirmed = requiredConfirmations.every(role => confirmations[role] === true);

    if (allConfirmed) {
        await handleAllConfirmationsComplete(submission);
    }
}

async function handleAllConfirmationsComplete(submission) {
    console.log(`Alle Bestätigungen sind eingegangen`);
}
  