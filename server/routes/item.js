// routes/item.js
const express = require('express');
const Item = require('../models/Item');

const router = express.Router();

// Add a new item (asset or liability)
router.post('/', async (req, res) => {
  const { name, amount, type } = req.body;
  try {
    const newItem = new Item({
      name,
      amount,
      type,
      user: req.user.userId // Associate the item with the logged-in user
    });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: 'Error adding item', error: err.message });
  }
});

// Get all items for the logged-in user
router.get('/', async (req, res) => {
  try {
    const items = await Item.find({ user: req.user.userId });
    res.json(items);
  } catch (err) {
    res.status(400).json({ message: 'Error fetching items', error: err.message });
  }
});

// Delete an item by ID
router.delete('/:id', async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting item', error: err.message });
  }
});

module.exports = router;
