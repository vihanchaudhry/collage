const express = require('express')
const router = express.Router()
const connectEnsureLogin = require('connect-ensure-login')
const Comment = require('../models/comment')
const Post = require('../models/post')
const User = require('../models/user')

// TEMPORARY
// Json payload of all posts
router.get('/', async (req, res) => {
  const posts = await Post.find()
  res.json({ posts })
})

// Create a post
router.post('/', 
  connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
    if (!req.body.title) { res.redirect('/submit') }
    const newPost = new Post()
    newPost.title = req.body.title
    newPost.user = req.user.username
    newPost.link = req.body.link
    newPost.text = req.body.text
    newPost.date = new Date()

    if (!newPost.user) {
      res.redirect('/submit')
    } else if (!newPost.link && !newPost.text) { 
      res.redirect('/submit') 
    } else {
      const savedPost = await newPost.save()
      // Update the user model with the new post id
      req.user.posts.push(savedPost._id)
      const updatedUser = await req.user.save()
      res.redirect('/posts/' + savedPost._id)
    }
})

// Show post
router.get('/:post_id', async (req, res) => {
  const post = await Post.findById(req.params.post_id)
  const user = await User.findOne({ username: post.user })
  const comments = await Comment.find({ post: req.params.post_id })
  res.render('post', { comments, post, user })
})

// Delete post

module.exports = router