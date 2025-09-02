const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const Schema = mongoose.Schema;

const app = express();
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
const MONGO_URI = "mongodb+srv://barend:4XzCN5UzEIV2mSiY@wealth-tracker.ff6cn.mongodb.net/"; // Replace with your actual MongoDB URI
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

const itemSchema = new Schema({
    name: String,
    amount: Number,
    type: String, // 'assets' or 'liabilities'
  });
  
  const Item = mongoose.model('Item', itemSchema);
  module.exports = Item;

// Route to handle POST request for saving data
app.post('/api/save', async (req, res) => {
    const { name, amount, type } = req.body;
  
    const newItem = new Item({ name, amount, type });
  
    try {
      await newItem.save();  // Save the item to MongoDB
      res.status(200).json({ message: 'Data saved successfully!' });
    } catch (error) {
      console.error('Error saving data:', error);
      res.status(500).json({ message: 'Error saving data to the database.' });
    }
  });
  
  // Default GET route to confirm the backend is working
  app.get('/', (req, res) => {
    res.send('Welcome to the backend API!');
  });

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
