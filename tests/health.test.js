import http from 'http';
import createApp from '../createApp.js';


describe('Health Endpoint', () => {
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

  test('GET /api/health should return status ok', async () => {
    const response = await fetch(`http://localhost:${port}/api/health`);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.status).toBe('ok');
    expect(data.timestamp).toBeDefined();
    expect(new Date(data.timestamp)).toBeInstanceOf(Date);
  });
});