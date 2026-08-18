const request = require("supertest");
const app = require("../../app");
const db = require("../../config/db");

describe("Tests d'intégration — API Utilisateur (/api/users)", () => {
  let token;
  let userId;
  const testUser = {
    username: "IntegrationUser",
    email: "integration_test@example.com",
    password: "password123",
  };

  beforeAll(async () => {
    // 1. Nettoyage des résidus si un test précédent a échoué
    await db.query("DELETE FROM users WHERE email = $1 OR username = $2", [
      testUser.email,
      testUser.username,
    ]);

    // 2. Inscription de l'utilisateur de test
    const registerRes = await request(app)
      .post("/api/auth/register")
      .send(testUser);

    userId = registerRes.body.user?.id;

    // 3. Connexion pour récupérer un token valide
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: testUser.email, password: testUser.password });

    token = loginRes.body.token;
  });

  afterAll(async () => {
    await db.query(
      "DELETE FROM users WHERE email = $1 OR email = $2 OR username = $3",
      [testUser.email, "nouveau_email@example.com", "nouveau_nom"],
    );
    await db.end();
  });

  describe("PUT /api/users/me/email", () => {
    it("devrait modifier l'email avec succès si le token est valide", async () => {
      const res = await request(app)
        .put("/api/users/me/email")
        .set("Authorization", `Bearer ${token}`)
        .send({ email: "nouveau_email@example.com" });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toMatch(/succès/i);
      expect(res.body.user.email).toBe("nouveau_email@example.com");
    });

    it("devrait rejeter la requête (401) si aucun token n'est fourni", async () => {
      const res = await request(app)
        .put("/api/users/me/email")
        .send({ email: "sans_token@example.com" });

      expect(res.statusCode).toBe(401);
    });

    it("devrait rejeter la requête (401/403) si le token est invalide", async () => {
      const res = await request(app)
        .put("/api/users/me/email")
        .set("Authorization", "Bearer token_invalide_12345")
        .send({ email: "bad_token@example.com" });

      expect([401, 403]).toContain(res.statusCode);
    });

    it("devrait renvoyer une erreur (400) si le champ email est manquant", async () => {
      const res = await request(app)
        .put("/api/users/me/email")
        .set("Authorization", `Bearer ${token}`)
        .send({});

      expect(res.statusCode).toBe(400);
    });
  });

  describe("PUT /api/users/me/username", () => {
    it("devrait modifier le pseudo avec succès si le token est valide", async () => {
      const res = await request(app)
        .put("/api/users/me/username")
        .set("Authorization", `Bearer ${token}`)
        .send({ username: "nouveau_nom" });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toMatch(/succès/i);
      expect(res.body.user.username).toBe("nouveau_nom");
    });

    it("devrait rejeter la requête (401) si aucun token n'est fourni", async () => {
      const res = await request(app)
        .put("/api/users/me/username")
        .send({ username: "nom_sans_token" });

      expect(res.statusCode).toBe(401);
    });

    it("devrait renvoyer une erreur (400) si le champ username est manquant", async () => {
      const res = await request(app)
        .put("/api/users/me/username")
        .set("Authorization", `Bearer ${token}`)
        .send({});

      expect(res.statusCode).toBe(400);
    });
  });

  /* -------------------------------------------------------------------------- */
  /*                     3. MODIFICATION DU MOT DE PASSE                         */
  /* -------------------------------------------------------------------------- */
  describe("PUT /api/users/me/password", () => {
    it("devrait modifier le mot de passe avec succès si le mot de passe actuel est bon", async () => {
      const res = await request(app)
        .put("/api/users/me/password")
        .set("Authorization", `Bearer ${token}`)
        .send({
          currentPassword: testUser.password, // 'password123'
          newPassword: "NouveauPassword123!",
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toMatch(/succès/i);
    });

    it("devrait rejeter la requête (401) si aucun token n'est fourni", async () => {
      const res = await request(app).put("/api/users/me/password").send({
        currentPassword: "NouveauPassword123!",
        newPassword: "AutrePassword123!",
      });

      expect(res.statusCode).toBe(401);
    });

    it("devrait renvoyer une erreur (400/401) si l'ancien mot de passe est incorrect", async () => {
      const res = await request(app)
        .put("/api/users/me/password")
        .set("Authorization", `Bearer ${token}`)
        .send({
          currentPassword: "MauvaisMotDePasse",
          newPassword: "AutrePassword123!",
        });

      expect([400, 401]).toContain(res.statusCode);
    });

    it("devrait renvoyer une erreur (400) si un des champs est manquant", async () => {
      const res = await request(app)
        .put("/api/users/me/password")
        .set("Authorization", `Bearer ${token}`)
        .send({
          currentPassword: "NouveauPassword123!",
          // newPassword manquant
        });

      expect(res.statusCode).toBe(400);
    });
  });

  /* -------------------------------------------------------------------------- */
  /*                          4. TEST DE RECONNEXION                            */
  /* -------------------------------------------------------------------------- */
  describe("POST /api/auth/login après modifications", () => {
    it("devrait réussir la connexion avec les nouveaux identifiants", async () => {
      const loginRes = await request(app).post("/api/auth/login").send({
        email: "nouveau_email@example.com",
        password: "NouveauPassword123!",
      });

      expect(loginRes.statusCode).toBe(200);
      expect(loginRes.body.token).toBeDefined();

      const token = loginRes.body.token;
      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.user.email).toBe("nouveau_email@example.com");
    });

    it("devrait échouer à la connexion avec l'ancien email ou l'ancien mot de passe", async () => {
      const loginResOldEmail = await request(app).post("/api/auth/login").send({
        email: "integration_test@example.com",
        password: "password123",
      });

      expect(loginResOldEmail.statusCode).toBe(401);
      expect(loginResOldEmail.body.token).toBeUndefined();
    });
  });
});
