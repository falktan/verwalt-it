import http from 'http';
import createApp from '../createApp.js';
import { createAccessToken } from '../api/utils/token.js';

process.env.USE_MOCK_DB = 'true';
process.env.ACCESS_TOKEN_ENCRYPTION_SECRET = '10BB4F59897A3599E97C288A81190DE8E68BA18A29415278BB99C97FC32A7620';
process.env.DISABLE_EMAIL = 'true';

describe('Delete Submission Endpoint', () => {
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

  test('POST /api/delete-submission should handle deletion with pruefungsamt role', async () => {
    // Test with non-existent submission (will fail but tests authorization)
    const submissionId = 'non-existent-id';
    const accessToken = createAccessToken({ submissionId, userRole: 'pruefungsamt' });

    const response = await fetch(`http://localhost:${port}/api/delete-submission`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accessToken })
    });

    // Should pass authorization (not 403) - might be 500 if submission doesn't exist
    expect(response.status).not.toBe(403);
  });

  test('POST /api/delete-submission should handle deletion with pruefungsausschuss role', async () => {
    // Test with non-existent submission (will fail but tests authorization)
    const submissionId = 'non-existent-id-2';
    const accessToken = createAccessToken({ submissionId, userRole: 'pruefungsausschuss' });

    const response = await fetch(`http://localhost:${port}/api/delete-submission`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accessToken })
    });

    // Should pass authorization (not 403) - might be 500 if submission doesn't exist
    expect(response.status).not.toBe(403);
  });

  test('POST /api/delete-submission should reject unauthorized roles', async () => {
    const submissionId = 'test-submission-id';
    const accessToken = createAccessToken({ submissionId, userRole: 'student' });

    const response = await fetch(`http://localhost:${port}/api/delete-submission`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accessToken })
    });

    const data = await response.json();
    
    expect(response.status).toBe(403);
    expect(data.error).toBe('Insufficient permissions');
  });

  test('POST /api/delete-submission should reject betreuer roles', async () => {
    const submissionId = 'test-submission-id';
    const accessToken = createAccessToken({ submissionId, userRole: 'betreuer_hochschule' });

    const response = await fetch(`http://localhost:${port}/api/delete-submission`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accessToken })
    });

    const data = await response.json();
    
    expect(response.status).toBe(403);
    expect(data.error).toBe('Insufficient permissions');
  });

  test('POST /api/delete-submission should reject requests without access token', async () => {
    const response = await fetch(`http://localhost:${port}/api/delete-submission`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    });

    const data = await response.json();
    
    expect(response.status).toBe(400);
    expect(data.error).toBe('Validation Error');
  });
});
