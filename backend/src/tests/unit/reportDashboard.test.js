const request = require('supertest');
const db = require('../../config/db');
const app = require('../../app');

describe('API Reports — GET /api/reports/dashboard', () => {
  let memberToken;
  let modToken;
  let memberUserId;
  let modUserId;
  let testTopicId;
  let testPostId;
  let reportId1;
  let reportId2;

  const memberUser = {
    username: 'StandardMember',
    email: 'standard_member@example.com',
    password: 'password123'
  };

  const modUser = {
    username: 'ModeratorUser',
    email: 'moderator_user@example.com',
    password: 'password123'
  };

  beforeAll(async () => {
    // 1. Nettoyage préventif
    await db.query('DELETE FROM users WHERE email IN ($1, $2)', [memberUser.email, modUser.email]);

    // 2. Création du membre standard
    const regMember = await request(app).post('/api/auth/register').send(memberUser);
    memberUserId = regMember.body.user?.id;

    const loginMember = await request(app).post('/api/auth/login').send({
      email: memberUser.email,
      password: memberUser.password
    });
    memberToken = loginMember.body.token;

    // 3. Création du modérateur (Passage du rôle en 'moderator' dans la BDD)
    const regMod = await request(app).post('/api/auth/register').send(modUser);
    modUserId = regMod.body.user?.id;

    await db.query("UPDATE users SET role = 'moderateur' WHERE id = $1", [modUserId]);

    // Connexion APRES la mise à jour du rôle pour générer un JWT avec le rôle 'moderator'
    const loginMod = await request(app).post('/api/auth/login').send({
      email: modUser.email,
      password: modUser.password
    });
    modToken = loginMod.body.token;

    // 4. Création de données de test (Topic, Post et Signalements)
    const topicRes = await db.query(
      "INSERT INTO topics (subcategory_id, user_id, title, content) VALUES (2, $1, 'Topic douteux', 'Contenu à vérifier') RETURNING id",
      [memberUserId]
    );
    testTopicId = topicRes.rows[0].id;

    const postRes = await db.query(
      "INSERT INTO posts (topic_id, user_id, content) VALUES ($1, $2, 'Post agressif') RETURNING id",
      [testTopicId, memberUserId]
    );
    testPostId = postRes.rows[0].id;

    // Insertion de signalements non résolus (is_resolved = false)
    const rep1 = await db.query(
      "INSERT INTO reports (reporter_id, topic_id, reason) VALUES ($1, $2, 'Propos hors charte') RETURNING id",
      [memberUserId, testTopicId]
    );
    reportId1 = rep1.rows[0].id;

    const rep2 = await db.query(
      "INSERT INTO reports (reporter_id, post_id, reason) VALUES ($1, $2, 'Insulte') RETURNING id",
      [memberUserId, testPostId]
    );
    reportId2 = rep2.rows[0].id;
  });

  afterAll(async () => {
    // Nettoyage en cascade
    if (reportId1) await db.query('DELETE FROM reports WHERE id = $1', [reportId1]);
    if (reportId2) await db.query('DELETE FROM reports WHERE id = $1', [reportId2]);
    if (testPostId) await db.query('DELETE FROM posts WHERE id = $1', [testPostId]);
    if (testTopicId) await db.query('DELETE FROM topics WHERE id = $1', [testTopicId]);
    await db.query('DELETE FROM users WHERE email IN ($1, $2)', [memberUser.email, modUser.email]);
    await db.end();
  });

  /* -------------------------------------------------------------------------- */
  /*                      TESTS ACCÈS TABLEAU DE BORD                           */
  /* -------------------------------------------------------------------------- */
  it('devrait autoriser l’accès et retourner la liste des signalements pour un modérateur', async () => {
    const response = await request(app)
      .get('/api/reports/dashboard')
      .set('Authorization', `Bearer ${modToken}`);

    expect(response.statusCode).toBe(200);
  expect(response.body).toHaveProperty('data');
  expect(Array.isArray(response.body.data)).toBe(true);
  expect(response.body.data.length).toBeGreaterThanOrEqual(2);
  });

  it('devrait interdire l’accès (403) si l’utilisateur est un membre standard', async () => {
    const response = await request(app)
      .get('/api/reports/dashboard')
      .set('Authorization', `Bearer ${memberToken}`);

    expect(response.statusCode).toBe(403);
    expect(response.body.message).toMatch(/accès refusé/i);
  });

  it('devrait rejeter la requête (401) si aucun token n’est fourni', async () => {
    const response = await request(app)
      .get('/api/reports/dashboard');

    expect(response.statusCode).toBe(401);
  });
});