const express = require("express");
const session = require("express-session");
const cors = require("cors");
const flash = require("connect-flash");
require("dotenv").config();

const bodyParser = require("body-parser");

const routes = require("./routes/index.js");
const passport = require("./middlewares/passport.middleware.js");

const server = express();

server.name = "API";

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(bodyParser.urlencoded({ extended: true }));

server.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

server.set("trust proxy", 1); // trust first proxy

const isProduction = process.env.ENVIRONMENT === "production";

server.use(session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: isProduction,
    },
  })
);

server.use(passport.initialize());
server.use(passport.session());

server.use(flash());
server.use("/v1/", routes);

// Error catching endware.
server.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports = server;
