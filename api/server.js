const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const authenticate = require("../auth/authenticate-middleware.js");
const authRouter = require("../auth/auth-router.js");
const jokesRouter = require("../jokes/jokes-router.js");

const server = express();
server.use(helmet());
server.use(express.json());
server.use("/api/auth", authRouter);
server.use(authenticate());
server.use("/api/jokes", jokesRouter);

module.exports = server;