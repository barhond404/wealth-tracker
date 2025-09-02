const { MongoClient } = require('mongodb');

// Replace <username>, <password>, and <cluster> with your MongoDB credentials
const uri = "mongodb+srv://barend:4XzCN5UzEIV2mSiY@wealth-tracker.mongodb.net";

async function connect() {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect(); // Connect to MongoDB
    console.log("Connected to MongoDB");
    return client.db("db1").collection("db1"); // Access your `db1` database and `db1` collection
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1); // Exit the process on failure
  }
}

module.exports = connect;
