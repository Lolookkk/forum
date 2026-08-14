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

    //Test de succès (Connexion réussie)
    it('devrait accepter la connexion sur le compte existant (statut 200)', async () => {
        const response = await request(app)
        .post('/api/auth/login')
        .send({
            email: 'test@example.com',
            password: 'password123'
        });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('user');
        expect(response.body.user).not.toHaveProperty('password_hash');
    });

    //Test d'erreur : Champs manquants
    it('devrait refuser la connexion (statut 400)', async () => {
        const response = await request(app)
        .post('/api/auth/login')
        .send({
            password: 'password123'
        });

        expect(response.statusCode).toBe(400);
    });

    //Test d'erreur : Identifiants invalides (Sécurité), envoyer un bon mail mais un mauvais mot de passe
    it('devrait refuser la connexion avec un mot de passe incorrect (statut 401)', async () => {
        const response = await request(app)
        .post('/api/auth/login')
        .send({
            email: 'test@example.com',
            password: 'wrongpassword'
        });

        expect(response.statusCode).toBe(401);
    });

});
