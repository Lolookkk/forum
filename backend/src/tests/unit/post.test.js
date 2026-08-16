const request = require('supertest');
const db = require('../../config/db');
const app = require('../../app');

describe('API Posts — PUT /api/posts/:id', () => {
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

    // 3. Inscription et connexion d'un second utilisateur (pour tester l'interdiction de modifier)
    const reg2 = await request(app).post('/api/auth/register').send(otherUser);
    otherUserId = reg2.body.user?.id;

    const login2 = await request(app).post('/api/auth/login').send({
      email: otherUser.email,
      password: otherUser.password
    });
    otherToken = login2.body.token;

    // 4. Création d'un topic temporaire
    const topicRes = await db.query(
      "INSERT INTO topics (subcategory_id, user_id, title, content) VALUES (2, $1, 'Topic pour test update', 'Contenu') RETURNING id",
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
    // Nettoyage en base de données
    if (testPostId) {
      await db.query('DELETE FROM posts WHERE id = $1', [testPostId]);
    }
    if (testTopicId) {
      await db.query('DELETE FROM topics WHERE id = $1', [testTopicId]);
    }
    await db.query('DELETE FROM users WHERE email IN ($1, $2)', [testUser.email, otherUser.email]);
    await db.end();
  });

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