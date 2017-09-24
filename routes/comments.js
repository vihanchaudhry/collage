const express = require('express')
const router = express.Router()
const connectEnsureLogin = require('connect-ensure-login')
const Comment = require('../models/comment')

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
    newComment.user = req.user._id
    newComment.post = req.params.post_id
    newComment.date = new Date()  
    newComment.save((err, product) => {
      if (err) { res.send(err) }
      res.redirect('/posts/' + req.params.post_id)
    })
  }
})

// Delete comment

module.exports = router