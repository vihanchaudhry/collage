const express = require('express')
const router = express.Router()
const User = require('../models/user')

// TEMPORARY
// Json payload of all users
router.get('/', (req, res) => {
  User.find((err, users) => {
    res.json({ users: users })
  })
})

// router.get('/:user_id', (req, res) => {
//   User.findById(req.params.user_id, (err, user) => {
//     if (err) { res.send(err) }
//     res.json(user)
//   })
// })

router.get('/:username', 
  (req, res) => {
    User.findOne({ username: req.params.username }, (err, user) => {
      if (err) { 
        res.send(err) 
      } else {
        res.render('user', { user: user })
      } 
    })
  }
)

module.exports = router
