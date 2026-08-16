const request = require('supertest');
const db = require('../../config/db');
const app = require('../../app');

describe('API Reports', () => {
  /* -------------------------------------------------------------------------- */
  /*                              VARIABLES GLOBALES                            */
  /* -------------------------------------------------------------------------- */

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

  /* -------------------------------------------------------------------------- */
  /*                              SETUP GLOBAL                                  */
  /* -------------------------------------------------------------------------- */

  beforeAll(async () => {
    // Nettoyage préventif
    await db.query(
      'DELETE FROM users WHERE email IN ($1, $2)',
      [memberUser.email, modUser.email]
    );

    /* ---------------------------------------------------------------------- */
    /*                         Création membre                                */
    /* ---------------------------------------------------------------------- */

    const regMember = await request(app)
      .post('/api/auth/register')
      .send(memberUser);

    expect(regMember.statusCode).toBe(201);

    memberUserId = regMember.body.user?.id;

    expect(memberUserId).toBeDefined();

    const loginMember = await request(app)
      .post('/api/auth/login')
      .send({
        email: memberUser.email,
        password: memberUser.password
      });

    expect(loginMember.statusCode).toBe(200);

    memberToken = loginMember.body.token;

    expect(memberToken).toBeDefined();

    /* ---------------------------------------------------------------------- */
    /*                         Création modérateur                            */
    /* ---------------------------------------------------------------------- */

    const regMod = await request(app)
      .post('/api/auth/register')
      .send(modUser);

    expect(regMod.statusCode).toBe(201);

    modUserId = regMod.body.user?.id;

    expect(modUserId).toBeDefined();

    // Passage du rôle en modérateur
    await db.query(
      "UPDATE users SET role = 'moderateur' WHERE id = $1",
      [modUserId]
    );

    // Connexion APRÈS modification du rôle
    const loginMod = await request(app)
      .post('/api/auth/login')
      .send({
        email: modUser.email,
        password: modUser.password
      });

    expect(loginMod.statusCode).toBe(200);

    modToken = loginMod.body.token;

    expect(modToken).toBeDefined();

    /* ---------------------------------------------------------------------- */
    /*                           Création du topic                             */
    /* ---------------------------------------------------------------------- */

    const topicRes = await db.query(
      `
        INSERT INTO topics
          (subcategory_id, user_id, title, content)
        VALUES
          (2, $1, 'Topic douteux', 'Contenu à vérifier')
        RETURNING id
      `,
      [memberUserId]
    );

    testTopicId = topicRes.rows[0].id;

    expect(testTopicId).toBeDefined();

    /* ---------------------------------------------------------------------- */
    /*                            Création du post                            */
    /* ---------------------------------------------------------------------- */

    const postRes = await db.query(
      `
        INSERT INTO posts
          (topic_id, user_id, content)
        VALUES
          ($1, $2, 'Post agressif')
        RETURNING id
      `,
      [testTopicId, memberUserId]
    );

    testPostId = postRes.rows[0].id;

    expect(testPostId).toBeDefined();

    /* ---------------------------------------------------------------------- */
    /*                         Création des signalements                      */
    /* ---------------------------------------------------------------------- */

    // Signalement du topic
    const rep1 = await db.query(
      `
        INSERT INTO reports
          (reporter_id, topic_id, reason)
        VALUES
          ($1, $2, 'Propos hors charte')
        RETURNING id
      `,
      [memberUserId, testTopicId]
    );

    reportId1 = rep1.rows[0].id;

    expect(reportId1).toBeDefined();

    // Signalement du post
    const rep2 = await db.query(
      `
        INSERT INTO reports
          (reporter_id, post_id, reason)
        VALUES
          ($1, $2, 'Insulte')
        RETURNING id
      `,
      [memberUserId, testPostId]
    );

    reportId2 = rep2.rows[0].id;

    expect(reportId2).toBeDefined();
  });

  /* -------------------------------------------------------------------------- */
  /*                              CLEANUP GLOBAL                                */
  /* -------------------------------------------------------------------------- */

  afterAll(async () => {
    // Suppression des signalements
    if (reportId1) {
      await db.query(
        'DELETE FROM reports WHERE id = $1',
        [reportId1]
      );
    }

    if (reportId2) {
      await db.query(
        'DELETE FROM reports WHERE id = $1',
        [reportId2]
      );
    }

    // Suppression du post
    if (testPostId) {
      await db.query(
        'DELETE FROM posts WHERE id = $1',
        [testPostId]
      );
    }

    // Suppression du topic
    if (testTopicId) {
      await db.query(
        'DELETE FROM topics WHERE id = $1',
        [testTopicId]
      );
    }

    // Suppression des utilisateurs
    await db.query(
      'DELETE FROM users WHERE email IN ($1, $2)',
      [memberUser.email, modUser.email]
    );

    /*
     * IMPORTANT :
     * db.end() doit être appelé UNE SEULE FOIS,
     * après tous les tests.
     */
    await db.end();
  });

  /* ========================================================================== */
  /*                     GET /api/reports/dashboard                            */
  /* ========================================================================== */

  describe('GET /api/reports/dashboard', () => {
    it(
      'devrait autoriser l’accès et retourner la liste des signalements pour un modérateur',
      async () => {
        const response = await request(app)
          .get('/api/reports/dashboard')
          .set('Authorization', `Bearer ${modToken}`);

        expect(response.statusCode).toBe(200);

        expect(response.body).toHaveProperty('data');

        expect(
          Array.isArray(response.body.data)
        ).toBe(true);

        expect(
          response.body.data.length
        ).toBeGreaterThanOrEqual(2);
      }
    );

    it(
      'devrait interdire l’accès (403) si l’utilisateur est un membre standard',
      async () => {
        const response = await request(app)
          .get('/api/reports/dashboard')
          .set('Authorization', `Bearer ${memberToken}`);

        expect(response.statusCode).toBe(403);

        expect(response.body.message)
          .toMatch(/accès refusé/i);
      }
    );

    it(
      'devrait rejeter la requête (401) si aucun token n’est fourni',
      async () => {
        const response = await request(app)
          .get('/api/reports/dashboard');

        expect(response.statusCode).toBe(401);
      }
    );
  });

  /* ========================================================================== */
  /*                    PUT /api/reports/:id/process                           */
  /* ========================================================================== */

  describe('PUT /api/reports/:id/process', () => {
    let tempPostId;
    let tempReportId;

    /* ---------------------------------------------------------------------- */
    /*                              SETUP TEST                                */
    /* ---------------------------------------------------------------------- */

    beforeEach(async () => {
      /*
       * Création d'un post dédié à chaque test.
       *
       * On utilise les variables du describe parent :
       * - testTopicId
       * - memberUserId
       */

      const postRes = await db.query(
        `
          INSERT INTO posts
            (topic_id, user_id, content)
          VALUES
            ($1, $2, 'Contenu modérable')
          RETURNING id
        `,
        [testTopicId, memberUserId]
      );

      tempPostId = postRes.rows[0].id;

      expect(tempPostId).toBeDefined();

      /* ------------------------------------------------------------------ */
      /*                     Création du signalement                        */
      /* ------------------------------------------------------------------ */

      const reportRes = await db.query(
        `
          INSERT INTO reports
            (reporter_id, post_id, reason)
          VALUES
            ($1, $2, 'À traiter')
          RETURNING id
        `,
        [memberUserId, tempPostId]
      );

      tempReportId = reportRes.rows[0].id;

      expect(tempReportId).toBeDefined();
    });

    /* ---------------------------------------------------------------------- */
    /*                              CLEANUP TEST                              */
    /* ---------------------------------------------------------------------- */

    afterEach(async () => {
      /*
       * Certains tests suppriment déjà le post via l'API.
       * On utilise donc des DELETE qui ne provoquent pas d'erreur
       * si la ligne n'existe plus.
       */

      if (tempReportId) {
        await db.query(
          'DELETE FROM reports WHERE id = $1',
          [tempReportId]
        );
      }

      if (tempPostId) {
        await db.query(
          'DELETE FROM posts WHERE id = $1',
          [tempPostId]
        );
      }
    });

    /* ====================================================================== */
    /*                              CENSOR                                    */
    /* ====================================================================== */

    it(
      'devrait censurer le contenu d’un post et résoudre le signalement (action: censor)',
      async () => {
        const response = await request(app)
          .put(`/api/reports/${tempReportId}/process`)
          .set('Authorization', `Bearer ${modToken}`)
          .send({
            action: 'censor',
            newContent: '[Message masqué par l’équipe de modération]'
          });

        expect(response.statusCode).toBe(200);

        expect(response.body).toHaveProperty('report');

        expect(
          response.body.report.is_resolved
        ).toBe(true);

        /* ---------------------------------------------------------------- */
        /*                 Vérification en BDD                               */
        /* ---------------------------------------------------------------- */

        const updatedPost = await db.query(
          'SELECT content FROM posts WHERE id = $1',
          [tempPostId]
        );

        expect(updatedPost.rows.length).toBe(1);

        expect(updatedPost.rows[0].content)
          .toBe('[Message masqué par l’équipe de modération]');
      }
    );

    /* ====================================================================== */
    /*                              DELETE                                    */
    /* ====================================================================== */

    it(
      'devrait supprimer le post ciblé et résoudre le signalement (action: delete)',
      async () => {
        const response = await request(app)
          .put(`/api/reports/${tempReportId}/process`)
          .set('Authorization', `Bearer ${modToken}`)
          .send({
            action: 'delete'
          });

        expect(response.statusCode).toBe(200);

        expect(response.body).toHaveProperty('report');

        expect(
          response.body.report.is_resolved
        ).toBe(true);

        /* ---------------------------------------------------------------- */
        /*                 Vérification en BDD                               */
        /* ---------------------------------------------------------------- */

        const checkPost = await db.query(
          'SELECT * FROM posts WHERE id = $1',
          [tempPostId]
        );

        expect(checkPost.rows.length).toBe(0);
      }
    );

    /* ====================================================================== */
    /*                              DISMISS                                   */
    /* ====================================================================== */

    it(
      'devrait rejeter/classer le signalement sans altérer le post (action: dismiss)',
      async () => {
        const response = await request(app)
          .put(`/api/reports/${tempReportId}/process`)
          .set('Authorization', `Bearer ${modToken}`)
          .send({
            action: 'dismiss'
          });

        expect(response.statusCode).toBe(200);

        expect(response.body).toHaveProperty('report');

        expect(
          response.body.report.is_resolved
        ).toBe(true);

        /* ---------------------------------------------------------------- */
        /*                 Vérification en BDD                               */
        /* ---------------------------------------------------------------- */

        const checkPost = await db.query(
          'SELECT content FROM posts WHERE id = $1',
          [tempPostId]
        );

        expect(checkPost.rows.length).toBe(1);

        expect(checkPost.rows[0].content)
          .toBe('Contenu modérable');
      }
    );

    /* ====================================================================== */
    /*                         ACTION INVALIDE                                */
    /* ====================================================================== */

    it(
      'devrait renvoyer un 400 si l’action demandée n’est pas valide',
      async () => {
        const response = await request(app)
          .put(`/api/reports/${tempReportId}/process`)
          .set('Authorization', `Bearer ${modToken}`)
          .send({
            action: 'invalide_action'
          });

        expect(response.statusCode).toBe(400);
      }
    );

    /* ====================================================================== */
    /*                         MEMBRE STANDARD                                */
    /* ====================================================================== */

    it(
      'devrait refuser (403) la tentative de traitement par un simple membre',
      async () => {
        const response = await request(app)
          .put(`/api/reports/${tempReportId}/process`)
          .set('Authorization', `Bearer ${memberToken}`)
          .send({
            action: 'dismiss'
          });

        expect(response.statusCode).toBe(403);
      }
    );

    /* ====================================================================== */
    /*                         SIGNALement INEXISTANT                          */
    /* ====================================================================== */

    it(
      'devrait renvoyer un 404 si le signalement n’existe pas',
      async () => {
        const response = await request(app)
          .put('/api/reports/999999/process')
          .set('Authorization', `Bearer ${modToken}`)
          .send({
            action: 'dismiss'
          });

        expect(response.statusCode).toBe(404);
      }
    );
  });
});