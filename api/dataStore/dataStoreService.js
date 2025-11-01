import database from './dbConnect.js';
import { decodeAccessToken, decryptData } from '../utils/token.js';


const mandant = 'fachhochschule_schmalkalden'


export async function storeNewSubmission({submissionId, formData}) {
  await database.collection(mandant).insertOne({
    _id: submissionId,
    formData,
    confirmations: {},
    createdAt: new Date()
  });
}

export async function getSubmission(accessToken) {
  const {submissionId} = decodeAccessToken(accessToken);
  const document = await database.collection(mandant).findOne({ _id: submissionId });

  if (!document) {
    throw new Error('Submission not found', submissionId);
  }

  return {
    formData: document.formData,
    confirmations: document.confirmations,
    createdAt: document.createdAt,
  }
}

export async function confirmSubmission({submissionId, userRole}) {
  const document = await database.collection(mandant).findOne({ _id: submissionId });

  document.confirmations[userRole] = true;

  await database.collection(mandant).updateOne({ _id: submissionId }, { $set: document });
}

export async function updateSubmission({submissionId, formData}) {
  const document = await database.collection(mandant).findOne({ _id: submissionId });

  document.formData = formData;

  await database.collection(mandant).updateOne({ _id: submissionId }, { $set: document });
}

export async function updateConfirmations({submissionId, confirmations}) {
  const document = await database.collection(mandant).findOne({ _id: submissionId });

  if (!document) {
    throw new Error('Submission not found', submissionId);
  }

  // Merge new confirmations with existing ones
  const updatedConfirmations = { ...document.confirmations, ...confirmations };

  await database.collection(mandant).updateOne(
    { _id: submissionId }, 
    { $set: { confirmations: updatedConfirmations } }
  );
}
