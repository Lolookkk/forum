const request = require("supertest");
const db = require("../../config/db");
const app = require("../../app");

describe("API Subcategories (/api/subcategories)", () => {
  let adminToken, adminUserId;
  let memberToken, memberUserId;
  let testCategoryId, createdSubCategoryId;

  const adminUser = {
    username: "AdminSubCatUser",
    email: "admin_subcat_test@example.com",
    password: "password123",
  };

  const memberUser = {
    username: "MemberSubCatUser",
    email: "member_subcat_test@example.com",
    password: "password123",
  };

  beforeAll(async () => {
    // 1. Nettoyage préventif
    await db.query("DELETE FROM users WHERE email IN ($1, $2)", [
      adminUser.email,
      memberUser.email,
    ]);
    await db.query("DELETE FROM categories WHERE name = 'Catégorie Test Subcat'");

    // 2. Création d'une catégorie de test pour rattachera les sous-catégories
    const catRes = await db.query(
      "INSERT INTO categories (name, description) VALUES ('Catégorie Test Subcat', 'Description test') RETURNING id;"
    );
    testCategoryId = catRes.rows[0].id;

    // 3. Création et authentification de l'administrateur
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

    // 4. Création et authentification du membre classique
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
    // Nettoyage complet des données générées
    if (testCategoryId) {
      await db.query("DELETE FROM categories WHERE id = $1", [testCategoryId]);
    }
    await db.query("DELETE FROM users WHERE email IN ($1, $2)", [
      adminUser.email,
      memberUser.email,
    ]);
    await db.end();
  });

  /* -------------------------------------------------------------------------- */
  /* 1. LECTURE (GET)                                                           */
  /* -------------------------------------------------------------------------- */
  describe("GET /api/subcategories", () => {
    it("devrait retourner la liste des sous-catégories avec un statut 200", async () => {
      const response = await request(app).get("/api/subcategories");

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it("devrait retourner la liste des sous-catégories d'une catégorie avec un statut 200", async () => {
      const response = await request(app).get(
        `/api/subcategories/category/${testCategoryId}`
      );

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  /* -------------------------------------------------------------------------- */
  /* 2. CRÉATION (POST)                                                         */
  /* -------------------------------------------------------------------------- */
  describe("POST /api/subcategories", () => {
    it("devrait créer une sous-catégorie si l'utilisateur est admin (201)", async () => {
      const response = await request(app)
        .post("/api/subcategories")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          category_id: testCategoryId,
          title: "Sous-catégorie Alpha",
          description: "Description de la sous-catégorie alpha",
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.subCategory).toHaveProperty("id");
      expect(response.body.subCategory.title).toBe("Sous-catégorie Alpha");
      expect(response.body.subCategory.category_id).toBe(testCategoryId);

      createdSubCategoryId = response.body.subCategory.id;
    });

    it("devrait renvoyer une erreur 400 si category_id, title ou description est manquant", async () => {
      const response = await request(app)
        .post("/api/subcategories")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          title: "Sans category_id ni description",
        });

      expect(response.statusCode).toBe(400);
    });

    it("devrait refuser la création (403) si l'utilisateur n'est pas admin", async () => {
      const response = await request(app)
        .post("/api/subcategories")
        .set("Authorization", `Bearer ${memberToken}`)
        .send({
          category_id: testCategoryId,
          title: "Sous-catégorie Interdite",
          description: "Tentative d'accès membre",
        });

      expect(response.statusCode).toBe(403);
    });

    it("devrait rejeter la requête (401) sans token", async () => {
      const response = await request(app)
        .post("/api/subcategories")
        .send({
          category_id: testCategoryId,
          title: "Anonyme",
          description: "Sans authentification",
        });

      expect(response.statusCode).toBe(401);
    });
  });

  /* -------------------------------------------------------------------------- */
  /* 3. RÉORGANISATION (PUT /reorder)                                           */
  /* -------------------------------------------------------------------------- */
  describe("PUT /api/subcategories/reorder", () => {
    it("devrait réorganiser l'ordre d'affichage pour un admin (200)", async () => {
      const response = await request(app)
        .put("/api/subcategories/reorder")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          subcategories: [{ id: createdSubCategoryId, display_order: 5 }],
        });

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body.subCategories)).toBe(true);
    });

    it("devrait renvoyer une erreur 400 si la structure envoyée est invalide", async () => {
      const response = await request(app)
        .put("/api/subcategories/reorder")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ subcategories: "format_invalide" });

      expect(response.statusCode).toBe(400);
    });

    it("devrait refuser la réorganisation (403) à un utilisateur non-admin", async () => {
      const response = await request(app)
        .put("/api/subcategories/reorder")
        .set("Authorization", `Bearer ${memberToken}`)
        .send({
          subcategories: [{ id: createdSubCategoryId, display_order: 1 }],
        });

      expect(response.statusCode).toBe(403);
    });
  });

  /* -------------------------------------------------------------------------- */
  /* 4. MODIFICATION (PUT /:id)                                                */
  /* -------------------------------------------------------------------------- */
  describe("PUT /api/subcategories/:id", () => {
    it("devrait modifier uniquement le nom de la sous-catégorie (200)", async () => {
      const response = await request(app)
        .put(`/api/subcategories/${createdSubCategoryId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ title: "Sous-catégorie Modifiée" });

      expect(response.statusCode).toBe(200);
      expect(response.body.subCategory.title).toBe("Sous-catégorie Modifiée");
    });

    it("devrait modifier uniquement la description de la sous-catégorie (200)", async () => {
      const response = await request(app)
        .put(`/api/subcategories/${createdSubCategoryId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ description: "Nouvelle description pour la sous-catégorie" });

      expect(response.statusCode).toBe(200);
      expect(response.body.subCategory.description).toBe(
        "Nouvelle description pour la sous-catégorie"
      );
    });

    it("devrait renvoyer une erreur 400 si aucun champ n'est fourni", async () => {
      const response = await request(app)
        .put(`/api/subcategories/${createdSubCategoryId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({});

      expect(response.statusCode).toBe(400);
    });

    it("devrait renvoyer 404 si la sous-catégorie n'existe pas", async () => {
      const response = await request(app)
        .put("/api/subcategories/999999")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ title: "Inexistante" });

      expect(response.statusCode).toBe(404);
    });
  });

  /* -------------------------------------------------------------------------- */
  /* 5. SUPPRESSION (DELETE /:id)                                              */
  /* -------------------------------------------------------------------------- */
  describe("DELETE /api/subcategories/:id", () => {
    it("devrait refuser la suppression (403) si l'utilisateur est un membre", async () => {
      const response = await request(app)
        .delete(`/api/subcategories/${createdSubCategoryId}`)
        .set("Authorization", `Bearer ${memberToken}`);

      expect(response.statusCode).toBe(403);
    });

    it("devrait supprimer la sous-catégorie pour un admin (200)", async () => {
      const response = await request(app)
        .delete(`/api/subcategories/${createdSubCategoryId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.statusCode).toBe(200);
    });

    it("devrait renvoyer 404 si la sous-catégorie à supprimer n'existe pas", async () => {
      const response = await request(app)
        .delete("/api/subcategories/999999")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.statusCode).toBe(404);
    });
  });
});