import { jest } from '@jest/globals';


// Mock the token utility to return deterministic values
jest.unstable_mockModule('../api/utils/token.js', () => ({
  createAccessToken: jest.fn(({ userRole }) => { return 'test-access-token'})
}));

// Import after mocking (required for ES6 modules)
const { renderEmailsNewSubmission } = await import('../api/emailRenderService.js');

describe('Email Render Service', () => {
  const mockFormData = {
    vorname: 'Max',
    nachname: 'Mustermann',
    email: 'max.mustermann@example.com',
    betreuer_betrieblich_email: 'betreuer.betrieblich@example.com',
    betreuer_hochschule_email: 'betreuer.hochschule@example.com',
    korreferent_email: 'betreuer.korreferent@example.com'
  };

  const mockSubmissionId = 'test-submission-123';

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

  test('should render all emails correctly', () => {
    const result = renderEmailsNewSubmission({ formData: mockFormData, submissionId: mockSubmissionId });
    
    expect(result).toMatchSnapshot();
  });
});