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
      studentName: 'Test Student',
      email: 'test@example.com'
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
});
