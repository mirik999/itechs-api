class Socket {

  constructor(socket, user, article) {
    this.io = socket;
    this.user = user;
    this.article = article;
  }

  socketEvents() {

    let connections = [];

    this.io.sockets.on('connection', socket => {
      connections.push(socket.id)

      // ########################### ONLINE - OFFLINE ########################### 

      this.user.find({ online: true }, (err, users) => {
        socket.broadcast.emit('onlineList', users)
      });

      socket.on('userOnline', data => {
        this.user.findOneAndUpdate({ _id: data.myID }, {
          $set: {
            online: true,
            socketID: socket.id
          }
        }).exec((err, foundUser) => {
          if (err) console.log(err);
          // return all users
          this.user.find({ online: true }, (err, users) => {
            socket.broadcast.emit('onlineList', users)
          });
        })
      })

      socket.on('userOffline', data => {
        this.user.findOneAndUpdate({ _id: data.myID }, {
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
        this.article.findByIdAndUpdate({ _id: articleID }, {
              $push: {
                comments: {
                    handleID,
                    articleID,
                    text, 
                    author: userID
                }
              }
            }, { new: true })
            .populate('comments.author', 'email useravatar username about contact portfolio github bgImg smallImage')
            .exec((err, article) => {
              if (err) return res.status(400).json({ AddCommentError: "Something went wrong, try again" })
              const addedComment = article.comments.filter(com => com.handleID === handleID)[0]
              this.io.sockets.emit('onComment', addedComment)
          })
      })

      socket.on('editComment', data => {
        const { articleID, handleID, text } = data;
        this.article.findOneAndUpdate({ _id: articleID, "comments.handleID": handleID },{
          $set: { "comments.$.text" : text },
          }, { new: true })
          .populate('comments.author', 'email useravatar username about contact portfolio github bgImg smallImage')
          .exec((err, article) => {
            if (err) return res.status(400).json({ DelCommentError: "Something went wrong, try again" })
            this.io.sockets.emit('editComment', article.comments)
        })
      })

      socket.on('delComment', data => {
        const { handleID, articleid } = data;
        this.article.findOneAndUpdate({ _id: articleid }, {
          $pull: {
            comments: { handleID }
          }
        }, { new: true })
        .populate('comments.author', 'email useravatar username about contact portfolio github bgImg smallImage')
        .exec((err, article) => {
          if (err) return res.status(400).json({ DelCommentError: "Something went wrong, try again" })
          this.io.sockets.emit('delComment', article.comments)
        })
      })

      // ############################## DISCONNECT AND SET OFFLINE USER ##############################

      socket.on('disconnect', () => {
        connections.splice(connections.indexOf(socket.id), 1);

        this.user.findOneAndUpdate({ socketID: socket.id }, {
          $set: {
            online: false,
            socketID: null
          }
        }).exec((err, foundUser) => {
          if (err) console.log(err);
          this.user.find({ online: true }, (err, users) => {
            socket.broadcast.emit('onlineList', users)
          });
        })
      })

    })

  }

  socketConfig() {
    this.io.use()
  }

}
