const request = require('supertest');
const db = require('../config/db');
const app = require('../app');

describe('API Authentification - POST /api/auth/register', () => {

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

describe('GET /api/auth/me', () => {

  // 1. Cas d'erreur : Aucun token fourni dans la requête
  it('devrait refuser l\'accès (401) si aucun token n\'est fourni', async () => {
    const response = await request(app)
      .get('/api/auth/me');

    // TODO: Vérifier que le statut HTTP est 401
    expect(response.statusCode).toBe(401);

    // TODO: Vérifier que le message d'erreur indique que le token est manquant
    expect(response.body.message).toBe('Accès refusé : Token manquant');
  });

  // 2. Cas d'erreur : Token invalide ou corrompu
  it('devrait refuser l\'accès (403) si le token est invalide', async () => {
    const response = await request(app)
      .get('/api/auth/me')
      // TODO: Ajouter le header Authorization avec un faux token
      .set('Authorization', 'Bearer faux_token_123');

    // TODO: Vérifier que le statut HTTP est 403
    expect(response.statusCode).toBe(403);

    // TODO: Vérifier le message de réponse pour token invalide
    expect(response.body.message).toBe('Accès refusé : Token invalide ou expiré');
  });

  // 3. Cas de succès : Token valide fourni
  it('devrait autoriser l\'accès (200) et renvoyer les données utilisateur', async () => {

    // Étape A : Se connecter pour récupérer un vrai token
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    
    const token = loginRes.body.token;

    // Étape B : Appeler la route protégée avec le token valide
    const response = await request(app)
      .get('/api/auth/me')
      // TODO: Ajouter le header Authorization avec le bon format : `Bearer ${token}`
      .set('Authorization', `Bearer ${token}`);

    // TODO: Vérifier que le statut HTTP est 200
    expect(response.statusCode).toBe(200);
    

    // TODO: Vérifier que response.body.user contient bien l'email 'test@example.com'
    expect(response.body.user.email).toBe('test@example.com');
  });

});

afterAll(async () => {
        await db.query("DELETE FROM users WHERE email = 'test@example.com'");
        await db.end();
    });