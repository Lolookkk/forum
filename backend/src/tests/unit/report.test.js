const request = require('supertest');
const db = require('../../config/db');
const app = require('../../app');

describe('API Reports — /api/reports', () => {
  let token;
  let testUserId;
  let testTopicId;
  let testPostId;
  let createdTopicReportId;
  let createdPostReportId;

  const testUser = {
    username: 'ReporterUser',
    email: 'reporter_test@example.com',
    password: 'password123'
  };

  beforeAll(async () => {
    // 1. Nettoyage préventif
    await db.query('DELETE FROM users WHERE email = $1', [testUser.email]);

    // 2. Inscription et connexion de l'utilisateur
    const regRes = await request(app).post('/api/auth/register').send(testUser);
    testUserId = regRes.body.user?.id;

    const loginRes = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: testUser.password
    });
    token = loginRes.body.token;

    // 3. Création d'un topic de test à signaler
    const topicRes = await db.query(
      "INSERT INTO topics (subcategory_id, user_id, title, slug, content) VALUES (2, $1, 'Topic à signaler', 'topic-a-signaler-' || extract(epoch from now())::int, 'Contenu inapproprié') RETURNING id",
      [testUserId]
    );
    testTopicId = topicRes.rows[0].id;

    // 4. Création d'un post de test à signaler
    const postRes = await db.query(
      "INSERT INTO posts (topic_id, user_id, content) VALUES ($1, $2, 'Post inapproprié') RETURNING id",
      [testTopicId, testUserId]
    );
    testPostId = postRes.rows[0].id;
  });

  afterAll(async () => {
    // Nettoyage complet dans l'ordre des contraintes SQL
    if (createdPostReportId) {
      await db.query('DELETE FROM reports WHERE id = $1', [createdPostReportId]);
    }
    if (createdTopicReportId) {
      await db.query('DELETE FROM reports WHERE id = $1', [createdTopicReportId]);
    }
    if (testPostId) {
      await db.query('DELETE FROM posts WHERE id = $1', [testPostId]);
    }
    if (testTopicId) {
      await db.query('DELETE FROM topics WHERE id = $1', [testTopicId]);
    }
    await db.query('DELETE FROM users WHERE email = $1', [testUser.email]);
    await db.end();
  });

  /* -------------------------------------------------------------------------- */
  /*                         1. SIGNALEMENT DE TOPIC                            */
  /* -------------------------------------------------------------------------- */
  describe('POST /api/topics/:id/reports', () => {
    it('devrait signaler un topic avec succès si le token et le motif sont fournis', async () => {
      const response = await request(app)
        .post(`/api/topics/${testTopicId}/reports`)
        .set('Authorization', `Bearer ${token}`)
        .send({ reason: 'Contenu haineux ou hors sujet' });

      expect(response.statusCode).toBe(201);
      expect(response.body.message).toMatch(/signalé avec succès/i);
      expect(response.body.report).toHaveProperty('id');
      expect(response.body.report.topic_id).toBe(testTopicId);
      expect(response.body.report.reason).toBe('Contenu haineux ou hors sujet');

      createdTopicReportId = response.body.report.id;
    });

    it('devrait renvoyer une erreur (400) si le motif (reason) est manquant', async () => {
      const response = await request(app)
        .post(`/api/topics/${testTopicId}/reports`)
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toMatch(/obligatoire/i);
    });

    it('devrait rejeter le signalement (401) si aucun token n’est fourni', async () => {
      const response = await request(app)
        .post(`/api/topics/${testTopicId}/reports`)
        .send({ reason: 'Tentative sans token' });

      expect(response.statusCode).toBe(401);
    });
  });

  /* -------------------------------------------------------------------------- */
  /*                          2. SIGNALEMENT DE POST                            */
  /* -------------------------------------------------------------------------- */
  describe('POST /api/posts/:id/reports', () => {
    it('devrait signaler un post avec succès si le token et le motif sont fournis', async () => {
      const response = await request(app)
        .post(`/api/posts/${testPostId}/reports`)
        .set('Authorization', `Bearer ${token}`)
        .send({ reason: 'Insultes dans ce message' });

      expect(response.statusCode).toBe(201);
      expect(response.body.message).toMatch(/signalé avec succès/i);
      expect(response.body.report).toHaveProperty('id');
      expect(response.body.report.post_id).toBe(testPostId);
      expect(response.body.report.reason).toBe('Insultes dans ce message');

      createdPostReportId = response.body.report.id;
    });

    it('devrait renvoyer une erreur (400) si le motif (reason) est manquant', async () => {
      const response = await request(app)
        .post(`/api/posts/${testPostId}/reports`)
        .set('Authorization', `Bearer ${token}`)
        .send({ reason: '   ' });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toMatch(/obligatoire/i);
    });

    it('devrait rejeter le signalement (401) si aucun token n’est fourni', async () => {
      const response = await request(app)
        .post(`/api/posts/${testPostId}/reports`)
        .send({ reason: 'Tentative sans token' });

      expect(response.statusCode).toBe(401);
    });
  });
});