import * as yup from 'yup';

// URL-Validierung für Spam-Vermeidung
const urlRegex = /(https?:\/\/|www\.|ftp:\/\/)/i;
const noUrlValidation = yup.string().test(
  'no-urls',
  'URLs sind in diesem Feld nicht erlaubt',
  function(value) {
    if (!value || value.trim() === '') return true; // Leere Werte sind erlaubt
    return !urlRegex.test(value);
  }
);

// Basis-Schema für gemeinsame Felder
const baseFormDataSchema = {
  nachname: noUrlValidation.required('Nachname ist erforderlich'),
  vorname: noUrlValidation.required('Vorname ist erforderlich'),
  geburtsdatum: noUrlValidation.required('Geburtsdatum ist erforderlich'),
  geburtsort: noUrlValidation.required('Geburtsort ist erforderlich'),
  matrikelnummer: noUrlValidation.required('Matrikelnummer ist erforderlich'),
  plz_ort: noUrlValidation.required('PLZ/Ort ist erforderlich'),
  wohnanschrift: noUrlValidation.required('Wohnanschrift ist erforderlich'),
  email: yup.string().email('Ungültige E-Mail-Adresse').required('E-Mail ist erforderlich'),
  studiengang: noUrlValidation.required('Studiengang ist erforderlich'),
  vertiefungsrichtung: noUrlValidation.default(''),
  thema: noUrlValidation.required('Thema ist erforderlich'),
  erste_bachelorarbeit: yup.string().oneOf(['ja', 'nein'], 'Ungültige Auswahl').required('Dieses Feld ist erforderlich'),
  einzelarbeit: yup.string().oneOf(['ja', 'nein'], 'Ungültige Auswahl').required('Dieses Feld ist erforderlich'),
  weitere_bearbeiter: noUrlValidation.default(''),
  noch_zu_erbringen: noUrlValidation.default(''),
  unternehmen_institution: noUrlValidation.required('Unternehmen/Institution ist erforderlich'),
  arbeitsort: noUrlValidation.required('Arbeitsort ist erforderlich'),
  betreuer_betrieblich_name: noUrlValidation.required('Name des betrieblichen Betreuers ist erforderlich'),
  betreuer_betrieblich_tel: noUrlValidation.required('Telefon des betrieblichen Betreuers ist erforderlich'),
  betreuer_betrieblich_email: yup.string().email('Ungültige E-Mail-Adresse').required('E-Mail des betrieblichen Betreuers ist erforderlich'),
  betreuer_hochschule_grad: noUrlValidation,
  betreuer_hochschule_name: noUrlValidation.required('Name des Hochschulbetreuers ist erforderlich'),
  betreuer_hochschule_tel: noUrlValidation.required('Telefon des Hochschulbetreuers ist erforderlich'),
  betreuer_hochschule_email: yup.string().email('Ungültige E-Mail-Adresse').required('E-Mail des Hochschulbetreuers ist erforderlich'),
  korreferent_grad: noUrlValidation,
  korreferent_name: noUrlValidation.required('Name des Korreferenten ist erforderlich'),
  korreferent_tel: noUrlValidation.required('Telefon des Korreferenten ist erforderlich'),
  korreferent_email: yup.string().email('Ungültige E-Mail-Adresse').required('E-Mail des Korreferenten ist erforderlich'),
  datenschutz_zustimmung: yup.string().oneOf(['on'], 'Datenschutzerklärung muss akzeptiert werden').required('Datenschutzerklärung muss akzeptiert werden')
};

// Schema für erste Erstellung durch Studenten (Prüfungsamt-Felder optional)
const formDataSchemaInitial = yup.object({
  ...baseFormDataSchema,
  pruefungsleistungen_noch_zu_erbringen: noUrlValidation.default(''),
  immatrikulation_laufend: yup.string().oneOf(['ja', 'nein', ''], 'Ungültige Auswahl').default(''),
  zulassung_praxissemester: yup.string().oneOf(['ja', 'nein', ''], 'Ungültige Auswahl').default('')
}).noUnknown(true, 'Unbekannte Felder sind nicht erlaubt');

// Schema für Updates durch Prüfungsamt (Prüfungsamt-Felder Pflicht)
const formDataSchemaUpdate = yup.object({
  ...baseFormDataSchema,
  pruefungsleistungen_noch_zu_erbringen: noUrlValidation.default(''),
  immatrikulation_laufend: yup.string().oneOf(['ja', 'nein'], 'Ungültige Auswahl').required('Immatrikulation im laufenden Semester ist erforderlich'),
  zulassung_praxissemester: yup.string().oneOf(['ja', 'nein'], 'Ungültige Auswahl').required('Zulassung zum Praxissemester ist erforderlich')
}).noUnknown(true, 'Unbekannte Felder sind nicht erlaubt');

// Schema für Access Token
const accessTokenSchema = yup.object({
  accessToken: yup.string().required('Access Token ist erforderlich')
}).noUnknown(true);

// Schema für Bestätigungen
const confirmationsSchema = yup.object({
  betreuer_betrieblich: yup.boolean().optional(),
  betreuer_hochschule: yup.boolean().optional(),
  korreferent: yup.boolean().optional(),
  pruefungsamt: yup.boolean().optional()
}).noUnknown(true);

// Endpunkt-spezifische Schemas
export const schemas = {
  createSubmission: yup.object({
    formData: formDataSchemaInitial.required()
  }).noUnknown(true),

  fetchSubmission: accessTokenSchema,

  confirmSubmission: accessTokenSchema,

  updateSubmission: yup.object({
    formData: formDataSchemaUpdate.required(),
    accessToken: yup.string().required('Access Token ist erforderlich')
  }).noUnknown(true),

  updateConfirmations: yup.object({
    confirmations: confirmationsSchema.required(),
    accessToken: yup.string().required('Access Token ist erforderlich')
  }).noUnknown(true),

  approveSubmission: accessTokenSchema
};

