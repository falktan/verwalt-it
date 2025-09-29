import 'dotenv/config';
import { createAccessToken } from './utils/token.js';


export function renderEmailsNewSubmission({formData, secrets}) {
	return [
		renderEmailNewSubmissionStudent({formData, secrets}),
		renderEmailNewSubmissionPruefungsamt({formData, secrets}),
		renderEmailNewSubmissionBetreuer({formData, secrets, role: 'betreuer_betrieblich'}),
		renderEmailNewSubmissionBetreuer({formData, secrets, role: 'betreuer_hochschule'}),
		renderEmailNewSubmissionBetreuer({formData, secrets, role: 'betreuer_korreferent'}),
	]
}

function renderEmailNewSubmissionStudent({formData, secrets}){
	const accessToken = createAccessToken({submissionId: secrets.submissionId, formEncryptionSecret: secrets.formEncryptionSecret, userRole: 'student'})
	const subject = `Anmeldung der Abschlussarbeit`
	const body = `
Sehr geehrte Frau/Herr ${formData.vorname} ${formData.nachname},
Vielen Dank für die Anmeldung der Abschlussarbeit.
Über folgenden Link können Sie den Status der Anmeldung verfolgen:
${process.env.BASE_URL}/form/confirm?token=${accessToken}
`;

	return {email_to: [formData.email], subject, body};
}

function renderEmailNewSubmissionBetreuer({formData, secrets, role: userRole}){
	const email_to = [formData[userRole + '_email']]
	const infoSentence = {
		betreuer_betrieblich: 'Sie wurden als betrieblicher Betreuer angegeben.',
		betreuer_hochschule: 'Sie wurden als Hochschulbetreuer angegeben.',
		betreuer_korreferent: 'Sie wurden als Korreferent angegeben.',
	}

	const accessToken = createAccessToken({submissionId: secrets.submissionId, formEncryptionSecret: secrets.formEncryptionSecret, userRole: userRole})
	const subject = `Anmeldung der Abschlussarbeit`
	const body = `
Sehr geehrte Damen und Herren,
von ${formData.vorname} ${formData.nachname} wurde soeben das Formular zur Anmeldung der Abschlussarbeit ausgefüllt.
${infoSentence[userRole]}
Bitte bestätigen Sie über folgenden Link die Anmeldung der Abschlussarbeit:
${process.env.BASE_URL}/form/confirm?token=${accessToken}
`;

	return {email_to, subject, body};
}

function renderEmailNewSubmissionPruefungsamt({formData, secrets}){
	const accessToken = createAccessToken({submissionId: secrets.submissionId, formEncryptionSecret: secrets.formEncryptionSecret, userRole: 'pruefungsamt'})
	const email_to = [process.env.EMAIL_PRUEFUNGSAMT_TO]
	const subject = `Anmeldung der Abschlussarbeit`
	const body = `
Liebes Prüfungsamt,
von ${formData.vorname} ${formData.nachname} wurde soeben das Formular zur Anmeldung der Abschlussarbeit ausgefüllt.
Bitte bearbeiten Sie die Anfrage über folgenden Link:
${process.env.BASE_URL}/form/confirm?token=${accessToken}
`;

	return {email_to, subject, body};
}

// Default export for the API
export default function renderEmail({formData, token}) {
	// Simple implementation for testing
	return {
		email: formData.email || 'test@example.com',
		subject: 'Test Email Subject',
		body: 'Test email body content'
	};
}
