import database from './dbConnect.js';
import { decodeAccessToken, decryptData } from '../utils/token.js';


const mandant = 'fachhochschule_schmalkalden'


export async function storeNewSubmission({submissionId, encryptedFormData}) {
  await database.collection(mandant).insertOne({
    _id: submissionId,
    encryptedFormData,
    confirmations: {},
    createdAt: new Date()
  });
}

export async function getSubmission(accessToken) {
  const {submissionId, formEncryptionSecret} = decodeAccessToken(accessToken);
  const document = await database.collection(mandant).findOne({ _id: submissionId });

  if (!document) {
    throw new Error('Submission not found', submissionId);
  }

  return {
    formData: decryptData(document.encryptedFormData, formEncryptionSecret),
    confirmations: document.confirmations,
    createdAt: document.createdAt,
  }
}

export async function confirmSubmission({submissionId, userRole}) {
  const document = await database.collection(mandant).findOne({ _id: submissionId });

  document.confirmations[userRole] = true;

  await database.collection(mandant).updateOne({ _id: submissionId }, { $set: document });
}

export async function updateSubmission({submissionId, encryptedFormData}) {
  const document = await database.collection(mandant).findOne({ _id: submissionId });

  document.encryptedFormData = encryptedFormData;

  await database.collection(mandant).updateOne({ _id: submissionId }, { $set: document });
}

export async function saveSubmission(formData) {
  // For testing purposes, generate a simple token
  const token = `test-token-${Date.now()}`;
  await storeNewSubmission({ submissionId: token, encryptedFormData: JSON.stringify(formData) });
  return token;
}

export async function getSubmissionById(token) {
  const document = await database.collection(mandant).findOne({ _id: token });
  if (!document) {
    return null;
  }
  return JSON.parse(document.encryptedFormData);
}
