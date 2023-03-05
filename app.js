require("dotenv").config();
require("express-async-errors");

//extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

//swagger
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");

const express = require("express");
const app = express();

//routers
const taskRouter = require("./src/routes/taskRoute.js");
const authRouter = require("./src/routes/authRoute");

//connect DB
const connectDB = require("./src/db/connection.js");
const authenticateUser = require("./src/middleware/authentication");

// error handler
const notFoundMiddleware = require("./src/middleware/not-found.js");
const errorMiddleware = require("./src/middleware/error-handler");

//middlewares

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

//routers

app.get("/", (req, res) => {
  res.send("<h1>TODO Api</h1><a href='/api-docs'>Documentation</a>");
});
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/task", authenticateUser, taskRouter);

//error middleware
app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = process.env.PORT || 5000;
const server = () => app.listen(port, console.log(`listening on port ${port}`));

const start = async () => {
  try {
    await connectDB();
    server();
  } catch (error) {
    console.log(error);
  }
};

module.exports = { app, start, server };
