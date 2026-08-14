const request = require('supertest');
const db = require('../config/db');
const app = require('../app');

describe('API Authentification - POST /api/auth/register', () => {

    afterAll(async () => {
        await db.query("DELETE FROM users WHERE email = 'test@example.com'");
        await db.end();
    });

    it('devrait créer un compte avec succès et retourner un statut 201', async () => {
        const response = await request(app)
        .post('/api/auth/register')
        .send({
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123'
        });

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('user');
        expect(response.body.user).not.toHaveProperty('password_hash');
    });

    it('devrait refuser la création si des champs sont manquants (statut 400)', async () => {
        const response = await request(app)
        .post('/api/auth/register')
        .send({
            username: 'testuser',
            email: 'test@example.com',
        });

        expect(response.statusCode).toBe(400);
    });

    it('devrait refuser la création si le compte existe déjà (statut 400)', async () => {
        const response = await request(app)
        .post('/api/auth/register')
        .send({
            username: 'testuser',
            email: 'test2@example.com',
            password: 'password123'
        });

        expect(response.statusCode).toBe(400);
    });
});
