import 'dotenv/config';
import { renderEmailsNewSubmission } from '../api/emailRenderService.js';

describe('Email Render Service', () => {
  const mockFormData = {
    vorname: 'Max',
    nachname: 'Mustermann',
    email: 'max.mustermann@example.com',
    betreuer_betrieblich_email: 'betreuer.betrieblich@example.com',
    betreuer_hochschule_email: 'betreuer.hochschule@example.com',
    betreuer_korreferent_email: 'betreuer.korreferent@example.com'
  };

  const mockSecrets = {
    submissionId: 'test-submission-123',
    formEncryptionSecret: 'test-encryption-secret'
  };

  beforeEach(() => {
    // Set up environment variables
    process.env.BASE_URL = 'https://test.example.com';
    process.env.EMAIL_PRUEFUNGSAMT_TO = 'pruefungsamt@example.com';
    process.env.ACCESS_TOKEN_ENCRYPTION_SECRET = 'test-access-token-secret';
  });

  afterEach(() => {
    // Clean up environment variables
    delete process.env.BASE_URL;
    delete process.env.EMAIL_PRUEFUNGSAMT_TO;
    delete process.env.ACCESS_TOKEN_ENCRYPTION_SECRET;
  });

  describe('renderEmailsNewSubmission', () => {
    test('should return array of 5 email objects', () => {
      const result = renderEmailsNewSubmission({ formData: mockFormData, secrets: mockSecrets });
      
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(5);
    });

    test('should return emails in correct order: student, pruefungsamt, betreuer_betrieblich, betreuer_hochschule, betreuer_korreferent', () => {
      const result = renderEmailsNewSubmission({ formData: mockFormData, secrets: mockSecrets });
      
      // Check that first email is for student
      expect(result[0].email_to).toEqual([mockFormData.email]);
      
      // Check that second email is for pruefungsamt
      expect(result[1].email_to).toEqual([process.env.EMAIL_PRUEFUNGSAMT_TO]);
      
      // Check that third email is for betreuer_betrieblich
      expect(result[2].email_to).toEqual([mockFormData.betreuer_betrieblich_email]);
      
      // Check that fourth email is for betreuer_hochschule
      expect(result[3].email_to).toEqual([mockFormData.betreuer_hochschule_email]);
      
      // Check that fifth email is for betreuer_korreferent
      expect(result[4].email_to).toEqual([mockFormData.betreuer_korreferent_email]);
    });
  });

  describe('Student Email', () => {
    test('should render student email with correct structure', () => {
      const result = renderEmailsNewSubmission({ formData: mockFormData, secrets: mockSecrets });
      const studentEmail = result[0];
      
      expect(studentEmail).toHaveProperty('email_to');
      expect(studentEmail).toHaveProperty('subject');
      expect(studentEmail).toHaveProperty('body');
      expect(studentEmail.email_to).toEqual([mockFormData.email]);
      expect(studentEmail.subject).toBe('Anmeldung der Abschlussarbeit');
    });

    test('should include confirmation link in student email body', () => {
      const result = renderEmailsNewSubmission({ formData: mockFormData, secrets: mockSecrets });
      const studentEmail = result[0];
      
      expect(studentEmail.body).toContain(`${process.env.BASE_URL}/form/confirm?token=`);
    });

    test('should include student name in email body', () => {
      const result = renderEmailsNewSubmission({ formData: mockFormData, secrets: mockSecrets });
      const studentEmail = result[0];
      
      expect(studentEmail.body).toContain(`Sehr geehrte Frau/Herr ${mockFormData.vorname} ${mockFormData.nachname}`);
    });
  });

  describe('Betreuer Emails', () => {
    test('should render all betreuer emails with correct structure', () => {
      const result = renderEmailsNewSubmission({ formData: mockFormData, secrets: mockSecrets });
      
      // Check betreuer_betrieblich (index 2)
      const betreuerBetrieblich = result[2];
      expect(betreuerBetrieblich.email_to).toEqual([mockFormData.betreuer_betrieblich_email]);
      expect(betreuerBetrieblich.subject).toBe('Anmeldung der Abschlussarbeit');
      expect(betreuerBetrieblich.body).toContain('Sie wurden als betrieblicher Betreuer angegeben.');
      
      // Check betreuer_hochschule (index 3)
      const betreuerHochschule = result[3];
      expect(betreuerHochschule.email_to).toEqual([mockFormData.betreuer_hochschule_email]);
      expect(betreuerHochschule.subject).toBe('Anmeldung der Abschlussarbeit');
      expect(betreuerHochschule.body).toContain('Sie wurden als Hochschulbetreuer angegeben.');
      
      // Check betreuer_korreferent (index 4)
      const betreuerKorreferent = result[4];
      expect(betreuerKorreferent.email_to).toEqual([mockFormData.betreuer_korreferent_email]);
      expect(betreuerKorreferent.subject).toBe('Anmeldung der Abschlussarbeit');
      expect(betreuerKorreferent.body).toContain('Sie wurden als Korreferent angegeben.');
    });

    test('should include confirmation link in all betreuer email bodies', () => {
      const result = renderEmailsNewSubmission({ formData: mockFormData, secrets: mockSecrets });
      
      for (let i = 2; i < 5; i++) {
        expect(result[i].body).toContain(`${process.env.BASE_URL}/form/confirm?token=`);
      }
    });

    test('should include student name in all betreuer email bodies', () => {
      const result = renderEmailsNewSubmission({ formData: mockFormData, secrets: mockSecrets });
      
      for (let i = 2; i < 5; i++) {
        expect(result[i].body).toContain(`von ${mockFormData.vorname} ${mockFormData.nachname}`);
      }
    });
  });

  describe('Prüfungsamt Email', () => {
    test('should render pruefungsamt email with correct structure', () => {
      const result = renderEmailsNewSubmission({ formData: mockFormData, secrets: mockSecrets });
      const pruefungsamtEmail = result[1];
      
      expect(pruefungsamtEmail.email_to).toEqual([process.env.EMAIL_PRUEFUNGSAMT_TO]);
      expect(pruefungsamtEmail.subject).toBe('Anmeldung der Abschlussarbeit');
      expect(pruefungsamtEmail.body).toContain('Liebes Prüfungsamt');
    });

    test('should include confirmation link in pruefungsamt email body', () => {
      const result = renderEmailsNewSubmission({ formData: mockFormData, secrets: mockSecrets });
      const pruefungsamtEmail = result[1];
      
      expect(pruefungsamtEmail.body).toContain(`${process.env.BASE_URL}/form/confirm?token=`);
    });

    test('should include student name in pruefungsamt email body', () => {
      const result = renderEmailsNewSubmission({ formData: mockFormData, secrets: mockSecrets });
      const pruefungsamtEmail = result[1];
      
      expect(pruefungsamtEmail.body).toContain(`von ${mockFormData.vorname} ${mockFormData.nachname}`);
    });
  });

  describe('Email Content Validation', () => {
    test('all emails should have consistent subject', () => {
      const result = renderEmailsNewSubmission({ formData: mockFormData, secrets: mockSecrets });
      
      result.forEach(email => {
        expect(email.subject).toBe('Anmeldung der Abschlussarbeit');
      });
    });

    test('all emails should contain confirmation link', () => {
      const result = renderEmailsNewSubmission({ formData: mockFormData, secrets: mockSecrets });
      
      result.forEach(email => {
        expect(email.body).toContain('/form/confirm?token=');
      });
    });

    test('all emails should have valid structure', () => {
      const result = renderEmailsNewSubmission({ formData: mockFormData, secrets: mockSecrets });
      
      result.forEach((email, index) => {
        expect(email).toHaveProperty('email_to');
        expect(email).toHaveProperty('subject');
        expect(email).toHaveProperty('body');
        expect(Array.isArray(email.email_to)).toBe(true);
        expect(typeof email.subject).toBe('string');
        expect(typeof email.body).toBe('string');
        expect(email.subject.length).toBeGreaterThan(0);
        expect(email.body.length).toBeGreaterThan(0);
      });
    });
  });
});