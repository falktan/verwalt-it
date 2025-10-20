import * as yup from 'yup';

// Basis-Schema für gemeinsame Felder
const baseFormDataSchema = {
  nachname: yup.string().required('Nachname ist erforderlich'),
  vorname: yup.string().required('Vorname ist erforderlich'),
  geburtsdatum: yup.string().required('Geburtsdatum ist erforderlich'),
  geburtsort: yup.string().required('Geburtsort ist erforderlich'),
  matrikelnummer: yup.string().required('Matrikelnummer ist erforderlich'),
  plz_ort: yup.string().required('PLZ/Ort ist erforderlich'),
  wohnanschrift: yup.string().required('Wohnanschrift ist erforderlich'),
  email: yup.string().email('Ungültige E-Mail-Adresse').required('E-Mail ist erforderlich'),
  studiengang: yup.string().required('Studiengang ist erforderlich'),
  vertiefungsrichtung: yup.string().default(''),
  thema: yup.string().required('Thema ist erforderlich'),
  erste_bachelorarbeit: yup.string().oneOf(['ja', 'nein'], 'Ungültige Auswahl').required('Dieses Feld ist erforderlich'),
  einzelarbeit: yup.string().oneOf(['ja', 'nein'], 'Ungültige Auswahl').required('Dieses Feld ist erforderlich'),
  weitere_bearbeiter: yup.string().default(''),
  noch_zu_erbringen: yup.string().default(''),
  unternehmen_institution: yup.string().required('Unternehmen/Institution ist erforderlich'),
  arbeitsort: yup.string().required('Arbeitsort ist erforderlich'),
  betreuer_betrieblich_name: yup.string().required('Name des betrieblichen Betreuers ist erforderlich'),
  betreuer_betrieblich_tel: yup.string().required('Telefon des betrieblichen Betreuers ist erforderlich'),
  betreuer_betrieblich_email: yup.string().email('Ungültige E-Mail-Adresse').required('E-Mail des betrieblichen Betreuers ist erforderlich'),
  hochschulbetreuer_grad: yup.string(),
  hochschulbetreuer_name: yup.string().required('Name des Hochschulbetreuers ist erforderlich'),
  hochschulbetreuer_tel: yup.string().required('Telefon des Hochschulbetreuers ist erforderlich'),
  hochschulbetreuer_email: yup.string().email('Ungültige E-Mail-Adresse').required('E-Mail des Hochschulbetreuers ist erforderlich'),
  korreferent_grad: yup.string(),
  korreferent_name: yup.string().required('Name des Korreferenten ist erforderlich'),
  korreferent_tel: yup.string().required('Telefon des Korreferenten ist erforderlich'),
  korreferent_email: yup.string().email('Ungültige E-Mail-Adresse').required('E-Mail des Korreferenten ist erforderlich'),
  datenschutz_zustimmung: yup.string().oneOf(['on'], 'Datenschutzerklärung muss akzeptiert werden').required('Datenschutzerklärung muss akzeptiert werden')
};

// Schema für erste Erstellung durch Studenten (Prüfungsamt-Felder optional)
const formDataSchemaInitial = yup.object({
  ...baseFormDataSchema,
  pruefungsleistungen_noch_zu_erbringen: yup.string().default(''),
  immatrikulation_laufend: yup.string().oneOf(['ja', 'nein', ''], 'Ungültige Auswahl').default(''),
  zulassung_praxissemester: yup.string().oneOf(['ja', 'nein', ''], 'Ungültige Auswahl').default('')
}).noUnknown(true, 'Unbekannte Felder sind nicht erlaubt');

// Schema für Updates durch Prüfungsamt (Prüfungsamt-Felder Pflicht)
const formDataSchemaUpdate = yup.object({
  ...baseFormDataSchema,
  pruefungsleistungen_noch_zu_erbringen: yup.string().default(''),
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
  betreuer_korreferent: yup.boolean().optional(),
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

