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
  // check if a user with this email already exists
  User.findOne({ email: req.body.email }, (err, user) => {
    if (user) {
      res.redirect('/signup')
    } else {
      const newUser = new User()
      newUser.email = req.body.email
      newUser.generateHash(req.body.password, (hash) => {
        newUser.password = hash
        newUser.save((err) => {
          if (err) { res.send(err) }
          res.redirect('/')
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

router.get('/profile', 
  connectEnsurelogin.ensureLoggedIn(), (req, res) => {
    res.render('profile', { user: req.user })
})

module.exports = router