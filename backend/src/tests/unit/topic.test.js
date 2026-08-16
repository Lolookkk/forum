const request = require("supertest");
const db = require("../../config/db");
const app = require("../../app");

describe("API Topics — /api/topics", () => {
  // Tokens et IDs
  let memberToken, memberUserId;
  let modToken, modUserId;
  let createdTopicId;

  // Utilisateurs de test
  const testUser = {
    username: "TopicTester",
    email: "topic_test@example.com",
    password: "password123",
  };

  const modUser = {
    username: "TopicModTester",
    email: "topic_mod_test@example.com",
    password: "password123",
  };

  beforeAll(async () => {
    // 1. Nettoyage préventif
    await db.query("DELETE FROM users WHERE email IN ($1, $2)", [
      testUser.email,
      modUser.email,
    ]);

    // 2. Inscription et connexion du membre classique
    const regMember = await request(app).post("/api/auth/register").send(testUser);
    memberUserId = regMember.body.user?.id;

    const loginMember = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });
    memberToken = loginMember.body.token;

    // 3. Inscription, élévation de rôle et connexion du modérateur
    const regMod = await request(app).post("/api/auth/register").send(modUser);
    modUserId = regMod.body.user?.id;

    await db.query("UPDATE users SET role = 'moderateur' WHERE id = $1", [modUserId]);

    const loginMod = await request(app).post("/api/auth/login").send({
      email: modUser.email,
      password: modUser.password,
    });
    modToken = loginMod.body.token;
  });

  afterAll(async () => {
    // Nettoyage complet
    if (createdTopicId) {
      await db.query("DELETE FROM topics WHERE id = $1", [createdTopicId]);
    }
    await db.query("DELETE FROM users WHERE email IN ($1, $2)", [
      testUser.email,
      modUser.email,
    ]);
    await db.end();
  });

  /* -------------------------------------------------------------------------- */
  /*                      1. LECTURE DES SUJETS PAR SOUS-CATÉGORIE              */
  /* -------------------------------------------------------------------------- */
  describe("GET /api/topics/subcategory/:id", () => {
    it("devrait retourner la liste des topics d’une sous-catégorie avec un statut 200", async () => {
      const response = await request(app).get("/api/topics/subcategory/2");

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  /* -------------------------------------------------------------------------- */
  /*                      2. CRÉATION D'UN SUJET (MEMBRE)                        */
  /* -------------------------------------------------------------------------- */
  describe("POST /api/topics/post", () => {
    it("devrait créer un topic avec succès si le token est valide et les champs sont remplis", async () => {
      const newTopicData = {
        subcategory_id: 2,
        title: "Sujet de test Jest",
        content: "Ceci est le contenu du sujet créé par le test d'intégration.",
      };

      const response = await request(app)
        .post("/api/topics/post")
        .set("Authorization", `Bearer ${memberToken}`)
        .send(newTopicData);

      expect(response.statusCode).toBe(201);
      expect(response.body.message).toMatch(/succès/i);
      expect(response.body.topic).toHaveProperty("id");
      expect(response.body.topic.title).toBe(newTopicData.title);

      // Conservation de l'ID pour les tests suivants et le nettoyage
      createdTopicId = response.body.topic.id;
    });

    it("devrait rejeter la création (401) si aucun token n’est fourni", async () => {
      const response = await request(app).post("/api/topics/post").send({
        subcategory_id: 2,
        title: "Test Sans Token",
        content: "Contenu",
      });

      expect(response.statusCode).toBe(401);
    });

    it("devrait renvoyer une erreur (400) si un champ obligatoire est manquant", async () => {
      const response = await request(app)
        .post("/api/topics/post")
        .set("Authorization", `Bearer ${memberToken}`)
        .send({
          subcategory_id: 2,
          title: "Titre sans contenu",
        });

      expect(response.statusCode).toBe(400);
    });
  });

  /* -------------------------------------------------------------------------- */
  /*                   3. DÉPLACEMENT D'UN SUJET (MODÉRATEUR)                  */
  /* -------------------------------------------------------------------------- */
  describe("PUT /api/topics/:id/move", () => {
    it("devrait déplacer le topic vers la nouvelle sous-catégorie (200) pour un modérateur", async () => {
      const newSubcategoryId = 1;

      const response = await request(app)
        .put(`/api/topics/${createdTopicId}/move`)
        .set("Authorization", `Bearer ${modToken}`)
        .send({ subcategoryId: newSubcategoryId });

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toMatch(/déplacé avec succès/i);
      expect(response.body.topic).toHaveProperty("id", createdTopicId);
      expect(response.body.topic.subcategory_id).toBe(newSubcategoryId);

      // Vérification directe en BDD
      const checkDb = await db.query("SELECT subcategory_id FROM topics WHERE id = $1", [
        createdTopicId,
      ]);
      expect(checkDb.rows[0].subcategory_id).toBe(newSubcategoryId);
    });

    it("devrait renvoyer une erreur (400) si subcategoryId est manquant", async () => {
      const response = await request(app)
        .put(`/api/topics/${createdTopicId}/move`)
        .set("Authorization", `Bearer ${modToken}`)
        .send({});

      expect(response.statusCode).toBe(400);
    });

    it("devrait refuser l’accès (403) à un membre standard", async () => {
      const response = await request(app)
        .put(`/api/topics/${createdTopicId}/move`)
        .set("Authorization", `Bearer ${memberToken}`)
        .send({ subcategoryId: 1 });

      expect(response.statusCode).toBe(403);
    });

    it("devrait rejeter la requête (401) si aucun token n’est fourni", async () => {
      const response = await request(app)
        .put(`/api/topics/${createdTopicId}/move`)
        .send({ subcategoryId: 1 });

      expect(response.statusCode).toBe(401);
    });

    it("devrait renvoyer un 404 si le topic est introuvable", async () => {
      const response = await request(app)
        .put("/api/topics/999999/move")
        .set("Authorization", `Bearer ${modToken}`)
        .send({ subcategoryId: 1 });

      expect(response.statusCode).toBe(404);
    });
  });
});