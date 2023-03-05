const mongoose = require("mongoose");

const { MONGO_URI, MONGO_URI_TEST, NODE_ENV } = process.env;

const connectionString = NODE_ENV === "test" ? MONGO_URI_TEST : MONGO_URI;

const connectDB = () => {
  return mongoose.connect(connectionString);
};

module.exports = connectDB;
