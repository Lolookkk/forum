const request = require("supertest");
const db = require("../../config/db");
const {
  updateUserEmail,
  updateUserUsername,
  updateUserPassword,
} = require("../../models/userModel");

describe("API users", () => {
  let testUserId;

  beforeAll(async () => {
    await db.query(
      "DELETE FROM users WHERE email = 'test@example.com' OR email = 'nouveau@example.com' OR username = 'testuser' OR username = 'updatedtestuser'",
    );
    const res = await db.query(
      "INSERT INTO users (email, username, password_hash) VALUES ('test@example.com', 'testuser', 'hashedpassword') RETURNING id",
    );
    testUserId = res.rows[0].id;
  });

  afterAll(async () => {
    const res = await db.query("DELETE FROM users WHERE id = $1", [testUserId]);
    await db.end();
  });

  describe("updateUserEmail()", () => {
    it("devrait modifier l'email de l'utilisateur en BDD et retourner les données à jour", async () => {
      // 1. Appeler updateUserEmail(testUserId, 'nouveau@example.com')
      const updatedUser = await updateUserEmail(
        testUserId,
        "nouveau@example.com",
      );
      // 2. Vérifier que l'objet retourné contient le nouvel email
      expect(updatedUser.email).toBe("nouveau@example.com");
      // 3. (Optionnel) Faire un SELECT en BDD pour vérifier que la valeur a bien changé
      const res = await db.query("SELECT email FROM users WHERE id = $1", [
        testUserId,
      ]);
      expect(res.rows[0].email).toBe("nouveau@example.com");
    });

    it("devrait lever une erreur SQL si l'email est déjà pris ou invalide", async () => {
      // 1. Tenter de mettre à jour l'email avec un email déjà existant
      await expect(
        updateUserEmail(testUserId, "modo@safespace.fr"),
      ).rejects.toThrow();
    });
  });

  describe("updateUserUsername()", () => {
    it("devrait modifier le nom d'utilisateur en BDD", async () => {
      const updatedUser = await updateUserUsername(
        testUserId,
        "updatedtestuser",
      );
      expect(updatedUser.username).toBe("updatedtestuser");
      const res = await db.query("SELECT username FROM users WHERE id = $1", [
        testUserId,
      ]);
      expect(res.rows[0].username).toBe("updatedtestuser");
    });
  });

  describe("updateUserPassword()", () => {
    it("devrait modifier le mot de passe haché en BDD", async () => {
      const updatedUser = await updateUserPassword(
        testUserId,
        "nouveaumdphash",
      );
      const res = await db.query(
        "SELECT password_hash FROM users WHERE id = $1",
        [testUserId],
      );
      expect(res.rows[0].password_hash).toBe("nouveaumdphash");
    });
  });
});
