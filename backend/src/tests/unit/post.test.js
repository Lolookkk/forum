const request = require('supertest');
const db = require('../../config/db');
const app = require('../../app');

describe('API Posts', () => {
  let token;
  let testUserId;
  let testTopicId;
  let createdPostId;

  const testUser = {
    username: 'PostTester',
    email: 'post_test@example.com',
    password: 'password123'
  };

  beforeAll(async () => {
    // 1. Nettoyage préventif
    await db.query('DELETE FROM users WHERE email = $1 OR username = $2', [testUser.email, testUser.username]);

    // 2. Inscription
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    testUserId = registerRes.body.user?.id;

    // 3. Connexion pour obtenir le token
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });

    token = loginRes.body.token;

    // 4. Création d'un topic temporaire en BDD pour y attacher les posts
    const topicRes = await db.query(
      "INSERT INTO topics (subcategory_id, user_id, title, content) VALUES (2, $1, 'Topic de test pour posts', 'Contenu du topic') RETURNING id",
      [testUserId]
    );
    testTopicId = topicRes.rows[0].id;
  });

  afterAll(async () => {
    // Nettoyage de la BDD dans l'ordre inverse des contraintes de clés étrangères
    if (createdPostId) {
      await db.query('DELETE FROM posts WHERE id = $1', [createdPostId]);
    }
    if (testTopicId) {
      await db.query('DELETE FROM topics WHERE id = $1', [testTopicId]);
    }
    await db.query('DELETE FROM users WHERE email = $1', [testUser.email]);
    await db.end();
  });

  describe('GET /api/posts/topic/:topic_id', () => {
    it('devrait retourner la liste des posts d’un topic avec un statut 200', async () => {
      const response = await request(app).get(`/api/posts/topic/${testTopicId}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });


  describe('POST /api/posts/post', () => {
    it('devrait créer un post avec succès si le token est valide et les champs sont remplis', async () => {
      const newPostData = {
        topic_id: testTopicId,
        content: 'Ceci est une réponse de test Jest.'
      };

      const response = await request(app)
        .post('/api/posts/post')
        .set('Authorization', `Bearer ${token}`)
        .send(newPostData);

      expect(response.statusCode).toBe(201);
      expect(response.body.message).toMatch(/succès/i);
      expect(response.body.post).toHaveProperty('id');
      expect(response.body.post.content).toBe(newPostData.content);

      createdPostId = response.body.post.id;
    });

    it('devrait rejeter la création (401) si aucun token n’est fourni', async () => {
      const response = await request(app)
        .post('/api/posts/post')
        .send({
          topic_id: testTopicId,
          content: 'Tentative sans token'
        });

      expect(response.statusCode).toBe(401);
    });

    it('devrait renvoyer une erreur (400) si un champ obligatoire est manquant', async () => {
      const response = await request(app)
        .post('/api/posts/post')
        .set('Authorization', `Bearer ${token}`)
        .send({
          topic_id: testTopicId
          // content manquant
        });

      expect(response.statusCode).toBe(400);
    });
  });
});