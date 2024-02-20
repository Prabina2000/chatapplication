// routes/messageRoutes.js

const express = require('express');
const Message = require('../models/Message');

const router = express.Router();

// Send message
router.post('/', async (req, res) => {
  try {
    const { sender, receiver, text } = req.body;
    console.log("yes")
    const message = new Message({ sender, receiver, text });
    await message.save();
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.log("sanfdksa",error)
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get messages between two users

router.get('/:senderId/:receiverId', async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;
    let { page, limit } = req.query;
    
    // Set default values for page and limit
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 50;

    const skip = (page - 1) * limit;

    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    })
    .sort({ timestamp: -1 }) // Sort in descending order
    .skip(skip)
    .limit(limit);

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});


module.exports = router;
