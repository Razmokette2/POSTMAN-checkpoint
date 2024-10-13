// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); 

const app = express();
app.use(express.json()); 

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Import the User model
const User = require('./models/User');

// 1. GET: Return all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. POST: Add a new user
app.post('/users', async (req, res) => {
  const { name, email, age } = req.body;
  
  try {
    const newUser = new User({ name, email, age });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 3. PUT: Edit a user by ID
app.put('/users/:id', async (req, res) => {
  const userId = req.params.id;
  const { name, email, age } = req.body;
  
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, { name, email, age }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 4. DELETE: Remove a user by ID
app.delete('/users/:id', async (req, res) => {
  const userId = req.params.id;
  
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
