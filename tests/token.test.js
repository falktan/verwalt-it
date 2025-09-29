import { jest } from '@jest/globals';
import 'dotenv/config';

// Import the functions to test
const { encryptData, decryptData, createAccessToken, decodeAccessToken, createSecret } = await import('../api/utils/token.js');

describe('Token Utils', () => {
  beforeEach(() => {
    // Set up environment variables
    process.env.ACCESS_TOKEN_ENCRYPTION_SECRET = 'test-access-token-secret';
  });

  afterEach(() => {
    // Clean up environment variables
    delete process.env.ACCESS_TOKEN_ENCRYPTION_SECRET;
  });

  describe('encryptData and decryptData', () => {
    test('should encrypt and decrypt data correctly', () => {
      const originalData = {
        submissionId: 'test-submission-123',
        userRole: 'student',
        formEncryptionSecret: 'test-encryption-secret',
        someOtherField: 'test-value'
      };

      const secret = 'test-secret-key';

      // Encrypt the data
      const encryptedData = encryptData(originalData, secret);

      // Verify encrypted data has the expected structure
      expect(encryptedData).toHaveProperty('iv');
      expect(encryptedData).toHaveProperty('authTag');
      expect(encryptedData).toHaveProperty('data');
      expect(typeof encryptedData.iv).toBe('string');
      expect(typeof encryptedData.authTag).toBe('string');
      expect(typeof encryptedData.data).toBe('string');

      // Decrypt the data
      const decryptedData = decryptData(encryptedData, secret);

      // Verify the decrypted data matches the original
      expect(decryptedData).toEqual(originalData);
    });

    test('should produce different encrypted data for same input (due to random IV)', () => {
      const originalData = { test: 'data' };
      const secret = 'test-secret';

      const encrypted1 = encryptData(originalData, secret);
      const encrypted2 = encryptData(originalData, secret);

      // The encrypted data should be different due to random IV
      expect(encrypted1.data).not.toBe(encrypted2.data);
      expect(encrypted1.iv).not.toBe(encrypted2.iv);
      expect(encrypted1.authTag).not.toBe(encrypted2.authTag);

      // But both should decrypt to the same original data
      expect(decryptData(encrypted1, secret)).toEqual(originalData);
      expect(decryptData(encrypted2, secret)).toEqual(originalData);
    });

    test('should fail to decrypt with wrong secret', () => {
      const originalData = { test: 'data' };
      const correctSecret = 'correct-secret';
      const wrongSecret = 'wrong-secret';

      const encryptedData = encryptData(originalData, correctSecret);

      // This should throw an error
      expect(() => {
        decryptData(encryptedData, wrongSecret);
      }).toThrow();
    });
  });

  describe('createAccessToken and decodeAccessToken', () => {
    test('should create and decode access token correctly', () => {
      const payload = {
        submissionId: 'test-submission-456',
        userRole: 'admin',
        formEncryptionSecret: 'test-form-secret'
      };

      // Create access token
      const accessToken = createAccessToken(payload);

      // Verify token is a string
      expect(typeof accessToken).toBe('string');
      expect(accessToken.length).toBeGreaterThan(0);

      // Decode access token
      const decodedPayload = decodeAccessToken(accessToken);

      // Verify decoded payload matches original
      expect(decodedPayload).toEqual(payload);
    });

    test('should remain unchanged when URL-encoded', () => {
      const payload = {
        submissionId: 'test-submission-789',
        userRole: 'student',
        formEncryptionSecret: 'test-form-secret-123'
      };
      const accessToken = createAccessToken(payload);
      const urlEncodedToken = encodeURIComponent(accessToken);
      expect(urlEncodedToken).toBe(accessToken);
    });
  });

  describe('createSecret', () => {
    test('should create a random secret', () => {
      const secret1 = createSecret();
      const secret2 = createSecret();

      // Verify secrets are strings
      expect(typeof secret1).toBe('string');
      expect(typeof secret2).toBe('string');

      // Verify secrets are different (very high probability)
      expect(secret1).not.toBe(secret2);

      // Verify secrets have reasonable length (base64 of 32 bytes = 44 characters)
      expect(secret1.length).toBe(44);
      expect(secret2.length).toBe(44);
    });
  });
});
