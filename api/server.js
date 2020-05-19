require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const authenticate = require("../auth/authenticate-middleware.js");
const authRouter = require("../auth/auth-router.js");
const jokesRouter = require("../jokes/jokes-router.js");

const server = express();

server.use(helmet());
server.use(cors({ credentials: true, origin: "http://localhost:3000" }));
server.use(cookieParser());
server.use(express.json());

server.use("/api/auth", authRouter);
server.use(authenticate);
server.use("/api/jokes", jokesRouter);

module.exports = server;