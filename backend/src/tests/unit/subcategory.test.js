const request = require("supertest");
const db = require("../../config/db");
const app = require("../../app");

describe("API Subcategories", () => {
  afterAll(async () => {
    await db.end();
  });

  it("devrait retourner la liste des sous-catégories avec un statut 200", async () => {
    const response = await request(app).get("/api/subcategories");

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it("devrait retourner la liste des sous-catégories d’une catégorie avec un statut 200", async () => {
    const response = await request(app).get("/api/subcategories/category/2");

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});
