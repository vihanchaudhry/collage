const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Post = require('../models/post')

// TEMPORARY
// Json payload of all users
router.get('/', async (req, res) => {
  const users = await User.find()
  res.json(users)
})

router.get('/:username', 
  async (req, res) => {
    const user = await User.findOne({ username: req.params.username })
    const posts = await Post.find({ user: user.username })
    posts.reverse()  // lists posts by newest first
    console.log(posts)
    res.render('user', { user, posts }) 
  }
)

module.exports = router
