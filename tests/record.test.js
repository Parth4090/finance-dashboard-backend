const request = require('supertest');
const app = require('../server');

describe('Record API Basics', () => {
    it('Should return 401 when accessing records without token', async () => {
        const response = await request(app).get('/api/records');
        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);
    });

    it('Should return 404 for unknown routes', async () => {
        const response = await request(app).get('/api/unknown/route/123');
        expect(response.statusCode).toBe(404);
    });
});
