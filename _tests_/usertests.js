const supertest = require("supertest");
const server = require("../api/server");
const Users = require("../auth/auth-model");
const db = require("../database/dbConfig");

afterAll(async () => {
  await db.destroy();
});

describe("register endpoint tests", () => {
  beforeEach(async () => {
    await db("users").truncate();
  });
  it("POST /register new user", async () => {
    await supertest(server)
      .post("/api/auth/register")
      .send({ username: "cool", password: "beans" })
      .then(res => {
        expect(res.statusCode).toBe(201);
      });
  });
  it("POST /register return with JSON", async () => {
    await supertest(server)
      .post("/api/auth/register")
      .send({ username: "cool", password: "beans" })
      .then(res => {
        expect(res.type).toBe("application/json");
      });
  });
});

describe("login & joke endpoint tests", () => {
  beforeEach(async () => {
    await db("users").truncate();
  });

  it("POST /login test & json test", async () => {
    await Users.add({ username: "cool", password: "beans" });

    await supertest(server)
      .post("/api/auth/login")
      .send({ username: "cool", password: "beans" })
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.type).toBe("application/json");
      });
  });

  it("GET /jokes token test", async () => {
    await Users.add({
      username: "cool2",
      password: "beans"
    });
    await supertest(server)
      .post("/api/auth/login")
      .send({ username: "cool2", password: "beans" })
      .then(res => {
        expect(res.type).toBe("application/json");
        return res.body.token;
      })
      .then(token => {
        return supertest(server)
          .get("/api/jokes")
          .set("Authorization", token)
          .expect(200);
      });
  });
  it("GET /jokes data test", async () => {
    await Users.add({
      username: "cool2",
      password: "beans"
    });
    await supertest(server)
      .post("/api/auth/login")
      .send({ username: "cool2", password: "beans" })
      .then(res => {
        return res.body.token;
      })
      .then(token => {
        return supertest(server)
          .get("/api/jokes")
          .set("Authorization", token)
          .then(res => {
            expect(res.body[0].id).toBe("0189hNRf2g");
            expect(res.body[1].joke).toBe(
              "Did you hear about the guy whose whole left side was cut off? He's all right now."
            );
          });
      });
  });
});