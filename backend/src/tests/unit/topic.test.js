const request = require('supertest');
const db = require('../../config/db');
const app = require('../../app');

describe('API Topics', () => {
    let token;
    let testUserId;
    let createdTopicId;

    const testUser = {
        username: 'TopicTester',
        email: 'topic_test@example.com',
        password: 'password123'
    };

    beforeAll(async () => {
        await db.query('DELETE FROM users WHERE email = $1 OR username = $2', [testUser.email, testUser.username]);

        const registerRes = await request(app)
        .post('/api/auth/register')
        .send(testUser);

        testUserId = registerRes.body.user?.id;

        const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
            email: testUser.email,
            password: testUser.password
        });

        token = loginRes.body.token;
    });

    afterAll(async () => {
        if (createdTopicId) {
        await db.query('DELETE FROM topics WHERE id = $1', [createdTopicId]);
        }
        await db.query('DELETE FROM users WHERE email = $1', [testUser.email]);
        await db.end();
    });


    it('devrait retourner la liste des topics d’une sous-catégorie avec un statut 200', async () => {
        const response = await request(app).get('/api/topics/subcategory/2');

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
    });


  describe('POST /api/topics/post', () => {
    it('devrait créer un topic avec succès si le token est valide et les champs sont remplis', async () => {
      const newTopicData = {
        subcategory_id: 2,
        title: 'Sujet de test Jest',
        content: 'Ceci est le contenu du sujet créé par le test d\'intégration.'
      };

      const response = await request(app)
        .post('/api/topics/post')
        .set('Authorization', `Bearer ${token}`)
        .send(newTopicData);

      expect(response.statusCode).toBe(201);
      expect(response.body.message).toMatch(/succès/i);
      expect(response.body.topic).toHaveProperty('id');
      expect(response.body.topic.title).toBe(newTopicData.title);

      // On conserve l'ID généré pour le supprimer dans afterAll
      createdTopicId = response.body.topic.id;
    });

    it('devrait rejeter la création (401) si aucun token n’est fourni', async () => {
      const response = await request(app)
        .post('/api/topics/post')
        .send({
          subcategory_id: 2,
          title: 'Test Sans Token',
          content: 'Contenu'
        });

      expect(response.statusCode).toBe(401);
    });

    it('devrait renvoyer une erreur (400) si un champ obligatoire est manquant', async () => {
      const response = await request(app)
        .post('/api/topics/post')
        .set('Authorization', `Bearer ${token}`)
        .send({
          subcategory_id: 2,
          title: 'Titre sans contenu'
          // content manquant
        });

      expect(response.statusCode).toBe(400);
    });
});
});