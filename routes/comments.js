const express = require('express')
const router = express.Router()
const connectEnsureLogin = require('connect-ensure-login')
const Comment = require('../models/comment')
const Post = require('../models/post')

// TEMPORARY
// Json payload of all comments that belong to :post_id
router.get('/posts/:post_id/comments/', async (req, res) => {
  const comments = await Comment.find({ post: req.params.post_id })
  res.json({ comments })
})

// Create a comment
router.post('/posts/:post_id/comments', 
connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
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
    const savedComment = await newComment.save()

    // Update the user with the new comment id
    req.user.comments.push(savedComment._id)
    const updatedUser = await req.user.save()
    const post = await Post.findById(req.params.post_id)

    // Update the post with the new comment id
    post.comments.push(savedComment._id)
    const updatedPost = await post.save()
    res.redirect('/posts/' + updatedPost._id)
  }
})

// Delete comment

module.exports = router