const express = require('express')
const router = express.Router()
const connectEnsureLogin = require('connect-ensure-login')
const Comment = require('../models/comment')
const Post = require('../models/post')
const User = require('../models/user')

// TEMPORARY
// Json payload of all posts
router.get('/', (req, res) => {
  Post.find((err, posts) => {
    res.json({ posts: posts })
  })
})

// Create a post
router.post('/', 
  connectEnsureLogin.ensureLoggedIn(), (req, res) => {
    if (!req.body.title) { res.redirect('/submit') }
    const newPost = new Post()
    newPost.title = req.body.title
    newPost.user = req.user._id
    newPost.link = req.body.link
    newPost.text = req.body.text
    newPost.date = new Date()

    if (!newPost.user) {
      res.redirect('/submit')
    } else if (!newPost.link && !newPost.text) { 
      res.redirect('/submit') 
    } else {
      newPost.save((err, product) => {
        if (err) { res.send(err) }
        res.redirect('/posts/' + product._id)
      })
    }
})

// Show post
router.get('/:post_id', (req, res) => {
  Post.findById(req.params.post_id, (err, post) => {
    if (err) { res.send(err) }
    User.findById(post.user, (err2, user) => {
      if (err2) { res.send(err2) }
      Comment.find({ post: req.params.post_id }, (err3, comments) => {
        if (err3) { res.send(err3) }
        res.render('post', { comments: comments, post: post, user: user })
      })
    })
  })
})

// Delete post

module.exports = router