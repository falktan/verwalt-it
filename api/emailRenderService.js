import 'dotenv/config';
import { createAccessToken } from './utils/token.js';


export function renderEmailsNewSubmission({formData, submissionId}) {
	return [
		renderEmailNewSubmissionStudent({formData, submissionId}),
		renderEmailNewSubmissionPruefungsamt({formData, submissionId}),
		renderEmailNewSubmissionBetreuer({formData, submissionId, role: 'betreuer_betrieblich'}),
		renderEmailNewSubmissionBetreuer({formData, submissionId, role: 'betreuer_hochschule'}),
		renderEmailNewSubmissionBetreuer({formData, submissionId, role: 'korreferent'}),
	]
}

function renderEmailNewSubmissionStudent({formData, submissionId}){
	const accessToken = createAccessToken({submissionId, userRole: 'student'})
	const subject = `Anmeldung der Abschlussarbeit`
	const body = `
Sehr geehrte Frau/Herr ${formData.vorname} ${formData.nachname},
Vielen Dank für die Anmeldung der Abschlussarbeit.
Über folgenden Link können Sie den Status der Anmeldung verfolgen:
${process.env.BASE_URL}/formular?token=${accessToken}`;

	return {emailTo: [formData.email], subject, body};
}

function renderEmailNewSubmissionBetreuer({formData, submissionId, role: userRole}){
	const emailTo = [formData[userRole + '_email']]
	const infoSentence = {
		betreuer_betrieblich: 'Sie wurden als betrieblicher Betreuer angegeben.',
		betreuer_hochschule: 'Sie wurden als Hochschulbetreuer angegeben.',
		korreferent: 'Sie wurden als Korreferent angegeben.',
	}

	const accessToken = createAccessToken({submissionId, userRole})
	const subject = `Anmeldung der Abschlussarbeit`
	const body = `
Sehr geehrte Damen und Herren,
von ${formData.vorname} ${formData.nachname} wurde soeben das Formular zur Anmeldung der Abschlussarbeit ausgefüllt.
${infoSentence[userRole]}
Bitte bestätigen Sie über folgenden Link die Anmeldung der Abschlussarbeit:
${process.env.BASE_URL}/formular?token=${accessToken}`;

	return {emailTo, subject, body};
}

function renderEmailNewSubmissionPruefungsamt({formData, submissionId}){
	const accessToken = createAccessToken({submissionId, userRole: 'pruefungsamt'})
	const emailTo = [process.env.EMAIL_PRUEFUNGSAMT_TO]
	const subject = `Anmeldung der Abschlussarbeit`
	const body = `
Liebes Prüfungsamt,
von ${formData.vorname} ${formData.nachname} wurde soeben das Formular zur Anmeldung der Abschlussarbeit ausgefüllt.
Bitte bearbeiten Sie die Anfrage über folgenden Link:
${process.env.BASE_URL}/formular?token=${accessToken}`;

	return {emailTo, subject, body};
}

export function renderEmailAllConfirmationsComplete({formData, submissionId}){
	const accessToken = createAccessToken({submissionId, userRole: 'pruefungsausschuss'})
	const emailTo = [process.env.EMAIL_PRUEFUNGSAUSSCHUSS_TO]
	const subject = `Alle Bestätigungen eingegangen - Abschlussarbeit`
	const body = `
Lieber Prüfungsausschuss,
alle Bestätigungen für die Abschlussarbeit von ${formData.vorname} ${formData.nachname} sind eingegangen.
Bitte bearbeiten Sie die Anfrage über folgenden Link:
${process.env.BASE_URL}/formular?token=${accessToken}`;

	return {emailTo, subject, body};
}

export function renderEmailPruefungsausschussApproval({formData}){
	const emailTo = process.env.EMAIL_FINAL_APPROVAL_RECIPIENTS.split(',');
	const subject = `Antrag auf Bachelorarbeit genehmigt - ${formData.vorname} ${formData.nachname}`
	const body = `
Sehr geehrte Damen und Herren,

der Antrag auf Ausgabe einer Bachelorarbeit wurde erfolgreich genehmigt.

Antragsteller:
- Name: ${formData.vorname} ${formData.nachname}
- Matrikelnummer: ${formData.matrikelnummer}
- Studiengang: ${formData.studiengang}
- Thema: ${formData.thema}

Betreuer:
- Betrieblicher Betreuer: ${formData.betreuer_betrieblich_name} (${formData.betreuer_betrieblich_email})
- Hochschulbetreuer: ${formData.betreuer_hochschule_name} (${formData.betreuer_hochschule_email})
- Korreferent: ${formData.korreferent_name} (${formData.korreferent_email})

Der Antrag wurde vom Prüfungsausschuss genehmigt und kann nun bearbeitet werden.

Mit freundlichen Grüßen
Verwalt-it.de`;

	return {emailTo, subject, body};
}
