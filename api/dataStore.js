import database from './dbConnect.js';
import crypto from 'crypto';


export async function saveSubmission(formData) {
  const id = crypto.randomUUID();

  const result = await database.collection('submissions').insertOne({
    _id: id,
    formData,
    createdAt: new Date()
  });

  console.log('Inserted document:', result);

  return id;
}

export async function getSubmissionById(id) {
  const document = await database.collection('submissions').findOne({ _id: id });
  return document.formData;
}
