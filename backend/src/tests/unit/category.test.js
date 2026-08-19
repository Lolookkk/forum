const request = require("supertest");
const db = require("../../config/db");
const app = require("../../app");

describe("API Categories (/api/categories)", () => {
  let adminToken, adminUserId;
  let memberToken, memberUserId;
  let createdCategoryId;

  const adminUser = {
    username: "AdminCatUser",
    email: "admin_cat_test@example.com",
    password: "password123",
  };

  const memberUser = {
    username: "MemberCatUser",
    email: "member_cat_test@example.com",
    password: "password123",
  };

  beforeAll(async () => {
    // 1. Nettoyage préventif des utilisateurs de test
    await db.query("DELETE FROM users WHERE email IN ($1, $2)", [
      adminUser.email,
      memberUser.email,
    ]);
    await db.query("DELETE FROM categories WHERE name LIKE 'Test Catégorie%'");

    // 2. Création et connexion de l'administrateur
    const regAdmin = await request(app)
      .post("/api/auth/register")
      .send(adminUser);
    adminUserId = regAdmin.body.user?.id;
    await db.query("UPDATE users SET role = 'admin' WHERE id = $1", [
      adminUserId,
    ]);

    const loginAdmin = await request(app).post("/api/auth/login").send({
      email: adminUser.email,
      password: adminUser.password,
    });
    adminToken = loginAdmin.body.token;

    // 3. Création et connexion du membre simple
    const regMember = await request(app)
      .post("/api/auth/register")
      .send(memberUser);
    memberUserId = regMember.body.user?.id;

    const loginMember = await request(app).post("/api/auth/login").send({
      email: memberUser.email,
      password: memberUser.password,
    });
    memberToken = loginMember.body.token;
  });

  afterAll(async () => {
    // Nettoyage des données créées pendant le test
    await db.query("DELETE FROM categories WHERE name LIKE 'Test Catégorie%'");
    await db.query("DELETE FROM users WHERE email IN ($1, $2)", [
      adminUser.email,
      memberUser.email,
    ]);
    await db.end(); // Fermeture de la connexion BDD
  });

  /* -------------------------------------------------------------------------- */
  /* 1. LECTURE PUBLIQUE (GET)                                                  */
  /* -------------------------------------------------------------------------- */
  describe("GET /api/categories", () => {
    it("devrait retourner la liste des catégories avec un statut 200", async () => {
      const response = await request(app).get("/api/categories");

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  /* -------------------------------------------------------------------------- */
  /* 2. CRÉATION (POST)                                                         */
  /* -------------------------------------------------------------------------- */
  describe("POST /api/categories", () => {
    it("devrait créer une catégorie si l'utilisateur est admin (201)", async () => {
      const response = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Test Catégorie Alpha",
          slug: "alpha",
          description: "Description de la catégorie alpha",
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.category).toHaveProperty("id");
      expect(response.body.category.name).toBe("Test Catégorie Alpha");
      expect(response.body.category.slug).toBe("alpha");

      createdCategoryId = response.body.category.id;
    });

    it("devrait renvoyer une erreur 400 si un champ est manquant", async () => {
      const response = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: "Seulement le nom" });

      expect(response.statusCode).toBe(400);
    });

    it("devrait refuser l'accès (403) si un membre tente de créer une catégorie", async () => {
      const response = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${memberToken}`)
        .send({
          name: "Test Catégorie Interdite",
          slug:"interdit",
          description: "Tentative membre",
        });

      expect(response.statusCode).toBe(403);
    });

    it("devrait rejeter la requête (401) sans token", async () => {
      const response = await request(app)
        .post("/api/categories")
        .send({ name: "Anonyme", slug:"anonyme", description: "Sans token" });

      expect(response.statusCode).toBe(401);
    });
  });

  /* -------------------------------------------------------------------------- */
  /* 3. RÉORGANISATION (PUT /reorder)                                           */
  /* -------------------------------------------------------------------------- */
  describe("PUT /api/categories/reorder", () => {
    it("devrait mettre à jour l'ordre d'affichage pour un admin (200)", async () => {
      const response = await request(app)
        .put("/api/categories/reorder")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          categories: [{ id: createdCategoryId, display_order: 99 }],
        });

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body.categories)).toBe(true);
    });

    it("devrait renvoyer une erreur 400 si le body ne contient pas un tableau valide", async () => {
      const response = await request(app)
        .put("/api/categories/reorder")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ categories: "invalide" });

      expect(response.statusCode).toBe(400);
    });

    it("devrait refuser l'accès (403) à un membre simple", async () => {
      const response = await request(app)
        .put("/api/categories/reorder")
        .set("Authorization", `Bearer ${memberToken}`)
        .send({
          categories: [{ id: createdCategoryId, display_order: 1 }],
        });

      expect(response.statusCode).toBe(403);
    });
  });

  /* -------------------------------------------------------------------------- */
  /* 4. MODIFICATION (PUT /:id)                                                */
  /* -------------------------------------------------------------------------- */
  describe("PUT /api/categories/:id", () => {
    it("devrait modifier uniquement le nom de la catégorie (200)", async () => {
      const response = await request(app)
        .put(`/api/categories/${createdCategoryId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: "Test Catégorie Modifiée" });

      expect(response.statusCode).toBe(200);
      expect(response.body.category.name).toBe("Test Catégorie Modifiée");
      expect(response.body.category.description).toBe(
        "Description de la catégorie alpha"
      );
    });

    it("devrait modifier uniquement la description de la catégorie (200)", async () => {
      const response = await request(app)
        .put(`/api/categories/${createdCategoryId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ description: "Nouvelle description mise à jour" });

      expect(response.statusCode).toBe(200);
      expect(response.body.category.name).toBe("Test Catégorie Modifiée");
      expect(response.body.category.description).toBe(
        "Nouvelle description mise à jour"
      );
    });

    it("devrait renvoyer une erreur 400 si aucun champ n'est fourni", async () => {
      const response = await request(app)
        .put(`/api/categories/${createdCategoryId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({});

      expect(response.statusCode).toBe(400);
    });

    it("devrait renvoyer 404 si la catégorie n'existe pas", async () => {
      const response = await request(app)
        .put("/api/categories/999999")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: "Inexistante" });

      expect(response.statusCode).toBe(404);
    });
  });

  /* -------------------------------------------------------------------------- */
  /* 5. SUPPRESSION (DELETE /:id)                                              */
  /* -------------------------------------------------------------------------- */
  describe("DELETE /api/categories/:id", () => {
    it("devrait refuser la suppression (403) si l'utilisateur est un membre", async () => {
      const response = await request(app)
        .delete(`/api/categories/${createdCategoryId}`)
        .set("Authorization", `Bearer ${memberToken}`);

      expect(response.statusCode).toBe(403);
    });

    it("devrait supprimer la catégorie si l'utilisateur est admin (200)", async () => {
      const response = await request(app)
        .delete(`/api/categories/${createdCategoryId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.statusCode).toBe(200);
    });

    it("devrait renvoyer 404 lors de la suppression d'une catégorie inexistante", async () => {
      const response = await request(app)
        .delete("/api/categories/999999")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.statusCode).toBe(404);
    });
  });
});