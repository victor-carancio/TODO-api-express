const request = require("supertest");

const mongoose = require("mongoose");

const { app, server } = require("../app");
const api = request(app);
const connectDB = require("../src/db/connection");
const user = require("../src/models/UserModel");
const task = require("../src/models/taskModel");

const initialUser = {
  name: "victor",
  email: "victor@gmail.com",
  password: "12345678",
};

const beforeEachTest = async () => {
  connectDB();
  await user.deleteMany({});
  const addInitialUser = await user.create(initialUser);
};

const getAuthorizationToken = async () => {
  const response = await api
    .post("/api/v1/auth/login")
    .send({ email: initialUser.email, password: initialUser.password });
  return response;
};

const createTasks = async (userId) => {
  await task.deleteMany({});

  const firstTaskAdded = await task.create({
    task: "json web token",
    createdBy: userId,
  });
  const secondTaskAdded = await task.create({
    task: "json web token",
    createdBy: userId,
  });
  return [firstTaskAdded, secondTaskAdded];
};

const afterAllTests = () => {
  mongoose.connection.close();
  server().close();
};
module.exports = {
  beforeEachTest,
  initialUser,
  api,
  afterAllTests,
  getAuthorizationToken,
  createTasks,
};
