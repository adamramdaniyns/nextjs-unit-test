import request from 'supertest';
import CryptoJS from 'crypto-js';

// Mock fungsi POST
jest.mock('next/server', () => ({
    NextResponse: {
        json: jest.fn(),
        status: jest.fn(),
    },
}));

describe('POST /api/decryptdata', () => {
    it('should return success message with decrypted data', async () => {
        const mockPayload = { id: 1,username:"Josh", password:"password" };
        const encryptedPayload = CryptoJS.AES.encrypt(
            JSON.stringify(mockPayload),
            'kocakgeming'
        ).toString();
        const hmacRequest = CryptoJS.HmacSHA256(encryptedPayload, 'kocakgeming').toString();

        const response = await request('http://localhost:3000')
            .post('/api/decryptdata')
            .send({
                _payload: encryptedPayload,
                _verification: hmacRequest,
            });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Success');
    });

    it('should return error if HMAC is invalid', async () => {
        const mockPayload = { id: 1, username:"Josh", password:"password" };
        const encryptedPayload = CryptoJS.AES.encrypt(
            JSON.stringify(mockPayload),
            'kocakgeming'
        ).toString();
        const hmacRequest = 'invalidhmac';

        const response = await request('http://localhost:3000')
            .post('/api/decryptdata')
            .send({
                _payload: encryptedPayload,
                _verification: hmacRequest,
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Encryption not valid');
    });

    it('should return error if decryption fails', async () => {
        const response = await request('http://localhost:3000')
            .post('/api/decryptdata')
            .send({
                _payload: 'invalidPayload',
                _verification: 'invalidHMAC',
            });

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Cannot send data to server');
    });
});
