const supertest = require("supertest");
const server = require("../api/server");
const db = require("../database/dbConfig");

afterAll(async () => {
  await db.destroy();
});

describe("Jokes Router", () => {
  it("Jokes", async () => {
    const res = await supertest(server).get("/api/jokes");

    expect(res.body.message).toMatch(/not authorized/i);
  });
});

describe("User Processes", () => {
  it("Register user", async () => {
    const user = { username: "buster", password: "bustertest" };
    const res = await supertest(server).post("/api/auth/register").send(user);

    expect(res.statusCode).toBe(201);
    expect(res.body.username).toBe("bob");
    expect(res.type).toBe("application/json");
  });


  it("Duplication Protection", async () => {
    const user = { username: "user1", password: "password1" };
    const res = await supertest(server).post("/api/auth/register").send(user);

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toMatch(/username is taken/i);
  });

  it("Incorrect password", async () => {
    const user = { username: "userFour", password: "passwordFour" };

    const register = await supertest(server)
      .post("/api/auth/register")
      .send(user);
    expect(register.statusCode).toBe(201);

    const wrongInfo = { username: "userFour", password: "passordFour" };

    const res = await supertest(server).post("/api/auth/login").send(wrongInfo);

    expect(res.statusCode).toBe(401);
    expect(res.type).toBe("application/json");
    expect(res.body.message).toMatch(/invalid credentials/i);
  });
});