const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../models/user')
const connectEnsurelogin = require('connect-ensure-login')

router.get('/', (req, res) => {
  res.render('index', { user: req.user })
})

router.get('/signup', (req, res) => {
  res.render('signup', { user: null })
})

router.post('/signup', (req, res) => {
  // check if any of the fields are empty
  if (!req.body.username || !req.body.password || !req.body.email) {
    res.redirect('/signup')
  }
  // check if a user with this username already exists
  User.findOne({ username: req.body.username }, (err, user) => {
    if (user) {
      res.redirect('/signup')
    } else {
      User.findOne({ email: req.body.email }, (err2, user2) => {
        if (user2) {
          res.redirect('/signup')
        }

        const newUser = new User()
        newUser.username = req.body.username
        newUser.email = req.body.email
        newUser.generateHash(req.body.password, (hash) => {
          newUser.password = hash
          newUser.save((err) => {
            if (err) { res.send(err) }
            res.redirect('/')
          })
        }) 
      })
    }
  })
})

router.get('/login', (req, res) => {
  res.render('login', { user: null })
})

router.post('/login',
  passport.authenticate('local', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/')
})

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

router.get('/submit',
  connectEnsurelogin.ensureLoggedIn(), (req, res) => {
    res.render('submit', { user: req.user })
})

module.exports = router