const app = require("./app");
require("dotenv").config();
const { connectMongo } = require("./db/connection");

const start = async () => {
  await connectMongo();

  app.listen(process.env.PORT, (err) => {
    if (err) console.error("Error at server launch:", err);
    console.log("Server running. Use our API on port: " + process.env.PORT);
  });
};

start();