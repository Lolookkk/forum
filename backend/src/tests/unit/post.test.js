const request = require('supertest');
const db = require('../../config/db');
const app = require('../../app');

describe('API Posts', () => {
  let token;
  let otherToken;
  let testUserId;
  let otherUserId;
  let testTopicId;
  let testPostId;

  const testUser = {
    username: 'PostAuthor',
    email: 'post_author@example.com',
    password: 'password123'
  };

  const otherUser = {
    username: 'OtherUser',
    email: 'other_user@example.com',
    password: 'password123'
  };

  beforeAll(async () => {
    // 1. Nettoyage préventif
    await db.query('DELETE FROM users WHERE email IN ($1, $2)', [testUser.email, otherUser.email]);

    // 2. Inscription et connexion de l'auteur principal
    const reg1 = await request(app).post('/api/auth/register').send(testUser);
    testUserId = reg1.body.user?.id;

    const login1 = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: testUser.password
    });
    token = login1.body.token;

    // 3. Inscription et connexion d'un second utilisateur
    const reg2 = await request(app).post('/api/auth/register').send(otherUser);
    otherUserId = reg2.body.user?.id;

    const login2 = await request(app).post('/api/auth/login').send({
      email: otherUser.email,
      password: otherUser.password
    });
    otherToken = login2.body.token;

    // 4. Création d'un topic temporaire
    const topicRes = await db.query(
      "INSERT INTO topics (subcategory_id, user_id, title, content) VALUES (2, $1, 'Topic pour tests', 'Contenu') RETURNING id",
      [testUserId]
    );
    testTopicId = topicRes.rows[0].id;

    // 5. Création d'un post appartenant à l'auteur principal
    const postRes = await db.query(
      "INSERT INTO posts (topic_id, user_id, content) VALUES ($1, $2, 'Contenu original') RETURNING id",
      [testTopicId, testUserId]
    );
    testPostId = postRes.rows[0].id;
  });

  afterAll(async () => {
    // Nettoyage complet
    if (testPostId) {
      await db.query('DELETE FROM post_likes WHERE post_id = $1', [testPostId]);
      await db.query('DELETE FROM posts WHERE id = $1', [testPostId]);
    }
    if (testTopicId) {
      await db.query('DELETE FROM topics WHERE id = $1', [testTopicId]);
    }
    await db.query('DELETE FROM users WHERE email IN ($1, $2)', [testUser.email, otherUser.email]);
    await db.end();
  });

  /* -------------------------------------------------------------------------- */
  /*                         1. MODIFICATION DE POST                            */
  /* -------------------------------------------------------------------------- */
  describe('PUT /api/posts/:id', () => {
    it('devrait modifier le post avec succès si l’utilisateur est l’auteur et le token valide', async () => {
      const response = await request(app)
        .put(`/api/posts/${testPostId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ content: 'Contenu du post mis à jour !' });

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toMatch(/succès/i);
      expect(response.body.post.content).toBe('Contenu du post mis à jour !');
    });

    it('devrait rejeter la modification (401) si aucun token n’est fourni', async () => {
      const response = await request(app)
        .put(`/api/posts/${testPostId}`)
        .send({ content: 'Tentative sans token' });

      expect(response.statusCode).toBe(401);
    });

    it('devrait renvoyer une erreur (400) si le champ content est manquant', async () => {
      const response = await request(app)
        .put(`/api/posts/${testPostId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(response.statusCode).toBe(400);
    });

    it('devrait renvoyer une erreur (404) si un autre utilisateur tente de modifier le post', async () => {
      const response = await request(app)
        .put(`/api/posts/${testPostId}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({ content: 'Tentative de modification non autorisée' });

      expect(response.statusCode).toBe(404);
    });
  });

  /* -------------------------------------------------------------------------- */
  /*                            2. AJOUT DE LIKE                                */
  /* -------------------------------------------------------------------------- */
  describe('POST /api/posts/:id/likes', () => {
    it('devrait ajouter un like si l’utilisateur est authentifié', async () => {
      const response = await request(app)
        .post(`/api/posts/${testPostId}/likes`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(201);
      expect(response.body.message).toMatch(/succès/i);
      expect(response.body.like).toHaveProperty('post_id', testPostId);
    });

    it('devrait rejeter le like (409) si le post a déjà été liké par cet utilisateur', async () => {
      const response = await request(app)
        .post(`/api/posts/${testPostId}/likes`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(409);
      expect(response.body.message).toMatch(/déjà liké/i);
    });

    it('devrait rejeter le like (401) si aucun token n’est fourni', async () => {
      const response = await request(app)
        .post(`/api/posts/${testPostId}/likes`);

      expect(response.statusCode).toBe(401);
    });
  });

  /* -------------------------------------------------------------------------- */
  /*                         3. SUPPRESSION DE LIKE                             */
  /* -------------------------------------------------------------------------- */
  describe('DELETE /api/posts/:id/likes', () => {
    it('devrait retirer le like existant', async () => {
      const response = await request(app)
        .delete(`/api/posts/${testPostId}/likes`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toMatch(/retiré avec succès/i);
    });

    it('devrait renvoyer une erreur (404) si l’utilisateur essaie de retirer un like inexistant', async () => {
      const response = await request(app)
        .delete(`/api/posts/${testPostId}/likes`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toMatch(/aucun like/i);
    });

    it('devrait rejeter la suppression (401) si aucun token n’est fourni', async () => {
      const response = await request(app)
        .delete(`/api/posts/${testPostId}/likes`);

      expect(response.statusCode).toBe(401);
    });
  });
});