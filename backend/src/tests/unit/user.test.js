const request = require("supertest");
const db = require("../../config/db");
const app = require("../../app");
const {
  updateUserEmail,
  updateUserUsername,
  updateUserPassword,
  updateUserRole,
  setBanStatus,
} = require("../../models/userModel");

describe("API Users & Modèle User", () => {
  // Tokens et IDs pour les tests d'intégration API
  let adminToken, adminUserId;
  let memberToken, memberUserId;

  // ID de l'utilisateur dédié aux tests unitaires du modèle
  let unitTestUserId;

  const adminUser = {
    username: "AdminRoleUser",
    email: "admin_role_test@example.com",
    password: "password123",
  };

  const memberUser = {
    username: "MemberRoleUser",
    email: "member_role_test@example.com",
    password: "password123",
  };

  beforeAll(async () => {
    // 1. Nettoyage préventif
    await db.query(
      "DELETE FROM users WHERE email IN ($1, $2, 'test@example.com', 'nouveau@example.com')",
      [adminUser.email, memberUser.email]
    );

    // 2. Création de l'utilisateur pour les tests unitaires du modèle
    const unitUserRes = await db.query(
      "INSERT INTO users (email, username, password_hash) VALUES ('test@example.com', 'testuser', 'hashedpassword') RETURNING id"
    );
    unitTestUserId = unitUserRes.rows[0].id;

    // 3. Inscription et élévation de l'Admin
    const regAdmin = await request(app).post("/api/auth/register").send(adminUser);
    adminUserId = regAdmin.body.user?.id;
    await db.query("UPDATE users SET role = 'admin' WHERE id = $1", [adminUserId]);

    const loginAdmin = await request(app).post("/api/auth/login").send({
      email: adminUser.email,
      password: adminUser.password,
    });
    adminToken = loginAdmin.body.token;

    // 4. Inscription du Membre simple
    const regMember = await request(app).post("/api/auth/register").send(memberUser);
    memberUserId = regMember.body.user?.id;

    const loginMember = await request(app).post("/api/auth/login").send({
      email: memberUser.email,
      password: memberUser.password,
    });
    memberToken = loginMember.body.token;
  });

  afterAll(async () => {
    // Nettoyage complet
    if (unitTestUserId) {
      await db.query("DELETE FROM users WHERE id = $1", [unitTestUserId]);
    }
    await db.query("DELETE FROM users WHERE email IN ($1, $2)", [
      adminUser.email,
      memberUser.email,
    ]);
    await db.end();
  });

  /* -------------------------------------------------------------------------- */
  /*                     1. TESTS UNITAIRES DU MODÈLE (userModel)               */
  /* -------------------------------------------------------------------------- */
  describe("Modèle userModel", () => {
    describe("updateUserEmail()", () => {
      it("devrait modifier l'email de l'utilisateur en BDD et retourner les données à jour", async () => {
        const updatedUser = await updateUserEmail(
          unitTestUserId,
          "nouveau@example.com"
        );
        expect(updatedUser.email).toBe("nouveau@example.com");

        const res = await db.query("SELECT email FROM users WHERE id = $1", [
          unitTestUserId,
        ]);
        expect(res.rows[0].email).toBe("nouveau@example.com");
      });

      it("devrait lever une erreur SQL si l'email est déjà pris", async () => {
        await expect(
          updateUserEmail(unitTestUserId, adminUser.email)
        ).rejects.toThrow();
      });
    });

    describe("updateUserUsername()", () => {
      it("devrait modifier le nom d'utilisateur en BDD", async () => {
        const updatedUser = await updateUserUsername(
          unitTestUserId,
          "updatedtestuser"
        );
        expect(updatedUser.username).toBe("updatedtestuser");

        const res = await db.query("SELECT username FROM users WHERE id = $1", [
          unitTestUserId,
        ]);
        expect(res.rows[0].username).toBe("updatedtestuser");
      });
    });

    describe("updateUserPassword()", () => {
      it("devrait modifier le mot de passe haché en BDD", async () => {
        await updateUserPassword(unitTestUserId, "nouveaumdphash");
        const res = await db.query(
          "SELECT password_hash FROM users WHERE id = $1",
          [unitTestUserId]
        );
        expect(res.rows[0].password_hash).toBe("nouveaumdphash");
      });
    });

    describe("updateUserRole()", () => {
      it("devrait mettre à jour le rôle de l'utilisateur en BDD", async () => {
        const updatedUser = await updateUserRole(unitTestUserId, "moderateur");
        expect(updatedUser.role).toBe("moderateur");

        const res = await db.query("SELECT role FROM users WHERE id = $1", [
          unitTestUserId,
        ]);
        expect(res.rows[0].role).toBe("moderateur");
      });
    });

    describe("setBanStatus()", () => {
      it("devrait mettre à jour le statut is_banned de l'utilisateur en BDD", async () => {
        const bannedUser = await setBanStatus(unitTestUserId, true);
        expect(bannedUser.is_banned).toBe(true);

        const unbannedUser = await setBanStatus(unitTestUserId, false);
        expect(unbannedUser.is_banned).toBe(false);
      });
    });
  });

  /* -------------------------------------------------------------------------- */
  /*            2. TESTS D'INTÉGRATION - PROMOTION DE RÔLE (SCRUM-26)           */
  /* -------------------------------------------------------------------------- */
  describe("PUT /api/users/:id/role", () => {
    it("devrait promouvoir un membre au rôle de modérateur pour un administrateur (200)", async () => {
      const response = await request(app)
        .put(`/api/users/${memberUserId}/role`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ role: "moderateur" });

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toMatch(/mis à jour avec succès/i);
      expect(response.body.user).toHaveProperty("id", memberUserId);
      expect(response.body.user.role).toBe("moderateur");
    });

    it("devrait renvoyer une erreur (400) si le champ rôle est manquant ou invalide", async () => {
      const response = await request(app)
        .put(`/api/users/${memberUserId}/role`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({});

      expect(response.statusCode).toBe(400);
    });

    it("devrait refuser l'accès (403) si un membre tente d'exécuter la promotion", async () => {
      const response = await request(app)
        .put(`/api/users/${memberUserId}/role`)
        .set("Authorization", `Bearer ${memberToken}`)
        .send({ role: "admin" });

      expect(response.statusCode).toBe(403);
    });

    it("devrait rejeter la requête (401) si aucun token n'est fourni", async () => {
      const response = await request(app)
        .put(`/api/users/${memberUserId}/role`)
        .send({ role: "moderateur" });

      expect(response.statusCode).toBe(401);
    });

    it("devrait renvoyer un 404 si l'utilisateur cible n'existe pas", async () => {
      const response = await request(app)
        .put("/api/users/999999/role")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ role: "moderateur" });

      expect(response.statusCode).toBe(404);
    });
  });

  /* -------------------------------------------------------------------------- */
  /*            3. TESTS D'INTÉGRATION - BANNISSEMENT UTILISATEUR               */
  /* -------------------------------------------------------------------------- */
  describe("PUT /api/users/:id/ban", () => {
    it("devrait bannir un utilisateur si la requête est émise par un admin (200)", async () => {
      const response = await request(app)
        .put(`/api/users/${memberUserId}/ban`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ isBanned: true });

      expect(response.statusCode).toBe(200);
      expect(response.body.user.is_banned).toBe(true);

      // Vérification directe en base de données
      const checkDb = await db.query("SELECT is_banned FROM users WHERE id = $1", [
        memberUserId,
      ]);
      expect(checkDb.rows[0].is_banned).toBe(true);
    });

    it("devrait bloquer (403) les requêtes authentifiées d'un utilisateur banni", async () => {
      // Le membre tente d'effectuer une requête avec son token alors qu'il est banni
      const response = await request(app)
        .put(`/api/users/${memberUserId}/role`)
        .set("Authorization", `Bearer ${memberToken}`)
        .send({ role: "admin" });

      expect(response.statusCode).toBe(403);
      expect(response.body.message).toMatch(/banni/i);
    });

    it("devrait débannir un utilisateur avec succès (200)", async () => {
      const response = await request(app)
        .put(`/api/users/${memberUserId}/ban`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ isBanned: false });

      expect(response.statusCode).toBe(200);
      expect(response.body.user.is_banned).toBe(false);
    });

    it("devrait renvoyer une erreur (400) si isBanned n'est pas un booléen", async () => {
      const response = await request(app)
        .put(`/api/users/${memberUserId}/ban`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ isBanned: "invalide" });

      expect(response.statusCode).toBe(400);
    });

    it("devrait refuser l'accès (403) si un membre tente de bannir un utilisateur", async () => {
      const response = await request(app)
        .put(`/api/users/${adminUserId}/ban`)
        .set("Authorization", `Bearer ${memberToken}`)
        .send({ isBanned: true });

      expect(response.statusCode).toBe(403);
    });

    it("devrait rejeter la requête (401) si aucun token n'est fourni", async () => {
      const response = await request(app)
        .put(`/api/users/${memberUserId}/ban`)
        .send({ isBanned: true });

      expect(response.statusCode).toBe(401);
    });

    it("devrait renvoyer un 404 si l'utilisateur cible n'existe pas", async () => {
      const response = await request(app)
        .put("/api/users/999999/ban")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ isBanned: true });

      expect(response.statusCode).toBe(404);
    });
  });
});