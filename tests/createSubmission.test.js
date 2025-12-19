import http from 'http';
import createApp from '../createApp.js';

process.env.USE_MOCK_DB = 'true';

describe('Create Submission Endpoint', () => {
  let server;
  let port;

  beforeAll((done) => {
    const app = createApp();
    server = http.createServer(app);
    server.listen(0, () => {
      port = server.address().port;
      done();
    });
  });

  afterAll((done) => {
    server.close(done);
  });

  test('POST /api/create-submission should create submission successfully', async () => {
    const formData = {
      nachname: 'Mustermann',
      vorname: 'Max',
      geburtsdatum: '2000-01-01',
      geburtsort: 'Berlin',
      matrikelnummer: '12345',
      plz_ort: '10115 Berlin',
      wohnanschrift: 'Musterstraße 1',
      email: 'user@example.com',
      studiengang: 'IT (722)',
      vertiefungsrichtung: 'Software Engineering',
      thema: 'Entwicklung einer modernen Webanwendung',
      erste_bachelorarbeit: 'ja',
      einzelarbeit: 'ja',
      weitere_bearbeiter: '',
      noch_zu_erbringen: 'Keine',
      unternehmen_institution: 'Musterfirma GmbH',
      arbeitsort: 'Berlin',
      betreuer_betrieblich_name: '',
      betreuer_betrieblich_tel: '',
      betreuer_betrieblich_email: '',
      betreuer_hochschule_grad: 'Prof. Dr.',
      betreuer_hochschule_name: 'Müller',
      betreuer_hochschule_tel: '03683-688-1234',
      betreuer_hochschule_email: 'user@example.com',
      korreferent_grad: 'Dr.',
      korreferent_name: 'Weber',
      korreferent_tel: '03683-688-5678',
      korreferent_email: 'user@example.com',
      datenschutz_zustimmung: 'on'
    };

    const response = await fetch(`http://localhost:${port}/api/create-submission`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ formData })
    });

    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.message).toBe('Submission created successfully');
  });

  test('POST /api/create-submission should reject invalid data', async () => {
    const invalidFormData = {
      nachname: 'Mustermann',
      email: 'invalid-email'
      // Fehlende erforderliche Felder
    };

    const response = await fetch(`http://localhost:${port}/api/create-submission`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ formData: invalidFormData })
    });

    const data = await response.json();
    
    expect(response.status).toBe(400);
    expect(data.error).toBe('Validation Error');
    expect(data.details).toBeDefined();
    expect(Array.isArray(data.details)).toBe(true);
  });
});
