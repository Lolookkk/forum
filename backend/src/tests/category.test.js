const request = require('supertest');
const db = require('../config/db');
const app = require('../app');

describe('GET /api/categories', () => {

    afterAll(async () => {
        await db.end(); // On ferme la connexion à Supabase
    });

    it('devrait retourner la liste des catégories avec un statut 200', async () => {
        const response = await request(app).get('/api/categories');

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
    });
});

