import Article from '../models/article-model';

module.exports = function (server, io) {

  let connections = [];

  io.on('connection', socket => {
    connections.push(socket.id)

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
          .populate('comments.author', 'email useravatar username about contact portfolio github')
          .exec((err, article) => {
            if (err) return res.status(400).json({ AddCommentError: "Something went wrong, try again" })
            const addedComment = article.comments.filter(com => com.handleID === handleID)[0]
            data.date = addedComment.date;
            io.sockets.emit('onComment', data)
        })
    })

    socket.on('editComment', data => {
      const { articleID, handleID, text } = data;
      Article.findOneAndUpdate({ _id: articleID, "comments.handleID": handleID },{
        $set: { "comments.$.text" : text },
        }, { new: true })
        .populate('comments.author', 'email useravatar username about contact portfolio github')
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
      .populate('comments.author', 'email useravatar username about contact portfolio github')
      .exec((err, article) => {
        if (err) return res.status(400).json({ DelCommentError: "Something went wrong, try again" })
        io.sockets.emit('delComment', article.comments)
      })
    })

    //disconnect user
    socket.on('disconnect', data => {
      connections.slice(connections.indexOf(socket.id), 1);
    })

  })

}