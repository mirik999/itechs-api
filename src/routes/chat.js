import express from 'express';
import Chat from '../models/chat-model';

const router = express.Router();

router.get('/get-history', (req, res) => {
  Chat.find({})
  .populate('message.author', 'email useravatar username about contact portfolio github bgImg smallImage socketID')
  .populate('message.reciever', 'email useravatar username about contact portfolio github bgImg smallImage socketID')
  .exec((err, messages) => {
    if (err) return res.status(400).json({ WentWrong: "Something Went Wrong When System Getting all articles" })
    res.json({ messages })
  })
})

export default router;