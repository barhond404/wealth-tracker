const express = require('express');
const saveData = require('./saveData'); // Import your save logic

const app = express();
app.use(express.json()); // Middleware to parse JSON data

app.post('/api/save', async (req, res) => {
    const { name, amount, type } = req.body;
    
    // Assuming you have a MongoDB model (e.g., Asset, Liability)
    const newItem = new YourModel({ name, amount, type });
  
    try {
      // Save the item to MongoDB
      await newItem.save();
      res.status(200).json({ message: 'Data saved successfully!' });
    } catch (error) {
      console.error('Error saving data:', error);
      res.status(500).json({ message: 'Error saving data to the database.' });
    }
  });
  

// Start the server
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
