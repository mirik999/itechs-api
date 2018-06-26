import mongoose from 'mongoose';
import Article from '../models/article-model';
import User from '../models/user-model';
import Chat from '../models/chat-model';

module.exports = function (server, io) {

  io.sockets.on('connection', socket => {

  // ########################### ONLINE - OFFLINE ########################### 

    User.find({}, (err, users) => {
      socket.broadcast.emit('onlineList', users)
    });

    socket.on('userOnline', data => {
      User.findOneAndUpdate({ _id: data.myID }, {
        $set: {
          online: true,
          socketID: socket.id
        }
      }).exec((err, foundUser) => {
        if (err) console.log(err);
        // return all users
        User.find({}, (err, users) => {
          socket.broadcast.emit('onlineList', users)
        });
      })
    })

    socket.on('userOffline', data => {
      User.findOneAndUpdate({ _id: data.myID }, {
        $set: {
          online: false,
          socketID: null
        }
      }).exec((err, foundUser) => {
        if (err) console.log(err);
        // logout-dan sonra re-render olur ve birinci socket ishleyir , ona gore burda hecne gondermirik.
      })
    })

  // ############################## COMMENTS ##############################

    socket.on('onComment', data => {
      const { articleID, userID, handleID, text } = data;
        Article.findByIdAndUpdate({ _id: articleID }, {
            $push: {
              comments: {
                  handleID,
                  articleID,
                  text, 
                  author: userID
              }
            }
          }, { new: true })
          .populate('comments.author', 'email useravatar username about contact portfolio github bgImg smallImage socketID')
          .exec((err, article) => {
            if (err) return res.status(400).json({ AddCommentError: "Something went wrong, try again" })
            const addedComment = article.comments.filter(com => com.handleID === handleID)[0]
            io.sockets.emit('onComment', addedComment)
        })
    })

    socket.on('editComment', data => {
      const { articleID, handleID, text } = data;
      Article.findOneAndUpdate({ _id: articleID, "comments.handleID": handleID },{
        $set: { "comments.$.text" : text },
        }, { new: true })
        .populate('comments.author', 'email useravatar username about contact portfolio github bgImg smallImage socketID')
        .exec((err, article) => {
          if (err) return res.status(400).json({ DelCommentError: "Something went wrong, try again" })
          io.sockets.emit('editComment', article.comments)
      })
    })

    socket.on('delComment', data => {
      const { handleID, articleid } = data;
      Article.findOneAndUpdate({ _id: articleid }, {
        $pull: {
          comments: { handleID }
        }
      }, { new: true })
      .populate('comments.author', 'email useravatar username about contact portfolio github bgImg smallImage socketID')
      .exec((err, article) => {
        if (err) return res.status(400).json({ DelCommentError: "Something went wrong, try again" })
        io.sockets.emit('delComment', article.comments)
      })
    })

  // ############################### private message ##############################

    socket.on('loadChatHistory', data => {
      Chat.find({ message: { author: mongoose.Types.ObjectId(data.myID) } })
        .populate('message.author', 'email useravatar username about contact portfolio github bgImg smallImage socketID')
        .populate('message.reciever', 'email useravatar username about contact portfolio github bgImg smallImage socketID')
        .exec((err, messages) => {
          if (err) console.log(err)
          socket.emit('loadChatHistory', messages)
        })
    })

    socket.on('privateMessage', data => {
      if (data.reciever.socketID === null) {
        new Chat({
          _id: new mongoose.Types.ObjectId(),
          message: {
            text: data.text,
            author: data.author._id,
            reciever: data.reciever._id
          }
        }).save()
      } else {
        socket.to(data.reciever.socketID).emit('privateMessageResponse', data);
        socket.to(data.author.socketID).emit('privateMessageResponse', data);
        new Chat({
          _id: new mongoose.Types.ObjectId(),
          message: {
            text: data.text,
            author: data.author._id,
            reciever: data.reciever._id
          }
        }).save()
      }
    })

  // ################################ disconnect ###################################
    socket.on('disconnect', () => {
      User.findOneAndUpdate({ socketID: socket.id }, {
        $set: {
          online: false,
          socketID: null
        }
      }).exec((err, foundUser) => {
        if (err) console.log(err);
        User.find({}, (err, users) => {
          socket.broadcast.emit('onlineList', users)
        });
      })
    })

  })

}