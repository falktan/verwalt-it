import 'dotenv/config';

export default function renderEmail({formData, token}) {
  const email = process.env.EMAIL_TO;
  const subject = `Anmeldung der Abschlussarbeit`;
  const body = `
    Sehr geehrte Damen und Herren,
    von ${formData.vorname || 'Vorname'} ${formData.nachname || 'Nachname'} wurde soeben das Formular zur Anmeldung der Abschlussarbeit ausgefüllt.
    Sie wurden als Betreuer angegeben.
    Bitte bestätigen Sie über folgenden Link die Anmeldung der Abschlussarbeit:
    ${process.env.BASE_URL}/form/confirm?token=${token}
  `;

  return { email, subject, body };
}
