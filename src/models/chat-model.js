import mongoose from 'mongoose';  

const schema = new mongoose.Schema({
  message: {
    text: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reciever: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now }
  } 
});

const Chat = mongoose.model('Chat', schema);

export default Chat;