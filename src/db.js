const { MongoClient } = require("mongodb");
require("dotenv").config();

const connectionUri = process.env.MONGO_URI;
const client = new MongoClient(connectionUri);

const connectDatabase = async () => {

  try {
    await client.connect();
    console.log("connected to DB");
  } catch (error) {
    console.error("Failed to connect to database", error);
  }
};

// console.log(mongodb);

module.exports = { client, connectDatabase };
