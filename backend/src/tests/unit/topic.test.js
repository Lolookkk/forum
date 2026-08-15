const request = require('supertest');
const db = require('../../config/db');
const app = require('../../app');

describe('API Topics', () => {

    afterAll(async () => {
        await db.end();
    });

    it('devrait retourner la liste des topics d’une sous-catégorie avec un statut 200', async () => {
        const response = await request(app).get('/api/topics/subcategory/2');

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
    });
});
