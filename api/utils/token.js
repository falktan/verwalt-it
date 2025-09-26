import crypto from 'crypto';


/**
 * This file contains functionlity to handle secrets.
 * Data entered in the form is encrypted with a `formEncryptionSecret`.
 * This secret is NOT stored on the server.
 * Instead it is sent to all users via email as part of their `accessToken`.
 * The benefit of this is that only with both - data from one of the users AND
 * data stored in the database - the data can be accessed.
 * 
 * In addtion the `accessToken` is used to ensure that only the intended recipient can act according to his `userRole`.
 * To ensure this, the access token contains the `userRole`.
 */


/**
 * 
 * @param accessToken an access token as created by createAccessToken
 * @returns an object like {submissionId, userRole, formEncryptionSecret}
 */
export function decodeAccessToken(accessToken) {
    const encryptedData = JSON.parse(Buffer.from(accessToken, 'base64url').toString('utf-8'));
    return decryptData(encryptedData, process.env.ACCESS_TOKEN_ENCRYPTION_SECRET);
}

export function createAccessToken({submissionId, formEncryptionSecret, userRole}) {
    const payload = {
        submissionId: submissionId,
        userRole,
        formEncryptionSecret: formEncryptionSecret
    }

    const data = encryptData(payload, process.env.ACCESS_TOKEN_ENCRYPTION_SECRET);

    return Buffer.from(JSON.stringify(data)).toString('base64url');
}

export function createSecret() {
    return crypto.randomBytes(32).toString('base64');
}

export function encryptData(data, secret) {
    const iv = crypto.randomBytes(12);
    const key = crypto.createHash('sha256').update(secret).digest();

    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

    const json = JSON.stringify(data);
    let encrypted = cipher.update(json, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    const authTag = cipher.getAuthTag();

    // Return all necessary data for decryption
    return {
        iv: iv.toString('base64'),
        authTag: authTag.toString('base64'),
        data: encrypted
    };
}

export function decryptData(encryptedData, secret) {
    const {iv, authTag, data} = encryptedData;
    const key = crypto.createHash('sha256').update(secret).digest();
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(iv, 'base64'));
    decipher.setAuthTag(Buffer.from(authTag, 'base64'));
    const decrypted = decipher.update(data, 'base64', 'utf8') + decipher.final('utf8');
    return JSON.parse(decrypted);
}
