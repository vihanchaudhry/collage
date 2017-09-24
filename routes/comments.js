const express = require('express')
const router = express.Router()
const connectEnsureLogin = require('connect-ensure-login')
const Comment = require('../models/comment')
const Post = require('../models/post')

// TEMPORARY
// Json payload of all comments that belong to :post_id
router.get('/posts/:post_id/comments/', (req, res) => {
  Comment.find({ post: req.params.post_id }, (err, comments) => {
    res.json({ comments: comments })
  })
})

// Create a comment
router.post('/posts/:post_id/comments', 
connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  if (!req.body.text) { 
    res.redirect('/posts/' + req.params.post_id) 
  } else if (!req.user) {
    res.redirect('/posts/' + req.params.post_id)
  } else {
    const newComment = new Comment()
    newComment.text = req.body.text
    newComment.user = req.user.username
    newComment.post = req.params.post_id
    newComment.date = new Date()  
    newComment.save((err, savedComment) => {
      if (err) { res.send(err) }
      // Update the user and post models with the new comment id
      req.user.comments.push(savedComment._id)
      req.user.save((err2, updatedUser) => {
        if (err2) { send.send(err2) }
        Post.findById(req.params.post_id, (err3, post) => {
          if (err3) { res.send(err3) }
          post.comments.push(savedComment._id)
          post.save((err4, updatedPost) => {
            if (err4) { res.send(err4) }
            res.redirect('/posts/' + updatedPost._id)
          })
        })
      })
    })
  }
})

// Delete comment

module.exports = router