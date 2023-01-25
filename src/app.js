require("dotenv").config();
require("express-async-errors");

//extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

const express = require("express");
const app = express();

//routers
const taskRouter = require("./routes/taskRoute.js");
const authRouter = require("./routes/authRoute");

//connect DB
const connectDB = require("./db/connection.js");
const authenticateUser = require("./middleware/authentication");

// error handler
const notFoundMiddleware = require("./middleware/not-found.js");
const errorMiddleware = require("./middleware/error-handler");

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

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/task", authenticateUser, taskRouter);

//error middleware
app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`listening on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
