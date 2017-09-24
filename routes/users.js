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

router.get('/:user_id', (req, res) => {
  User.findById(req.params.user_id, (err, user) => {
    if (err) { res.send(err) }
    res.json(user)
  })
})

module.exports = router
