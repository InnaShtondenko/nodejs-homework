const mongoose = require("mongoose");
require('dotenv').config();

async function connectMongo() {
  try {
    await mongoose.connect(
      process.env.MONGO_URL
    );
    console.log("Database connection successful");
  } catch (error) {
    console.log("Database connection error!", error);
    process.exit(1);
  }
}

module.exports = {
  connectMongo,
};