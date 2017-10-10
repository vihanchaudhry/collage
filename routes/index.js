const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../models/user')
const connectEnsurelogin = require('connect-ensure-login')

router.get('/', (req, res) => {
  res.render('home', { user: req.user })
})

router.get('/signup', (req, res) => {
  res.render('signup', { user: null })
})

router.post('/signup', async (req, res) => {
  // check if any of the fields are empty
  if (!req.body.username || !req.body.password || !req.body.email) {
    res.redirect('/signup')
  }

  // check if a user with this username already exists
  const userFromUsername = await User.findOne({ username: req.body.username })
  if (userFromUsername) {
    res.redirect('/signup')
  }

  // check if a user with this email already exists
  const userFromEmail = await User.findOne({ email: req.body.email })
  if (userFromEmail) {
    res.redirect('/signup')
  }

  const newUser = new User()    
  newUser.generateHash(req.body.password, async (hash) => {
    newUser.username = req.body.username
    newUser.email = req.body.email
    newUser.password = hash
    await newUser.save()
    res.redirect('/')
  })
})

router.get('/login', (req, res) => {
  res.render('login', { user: null })
})

router.post('/login',
  passport.authenticate('local', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/')
})

router.get('/auth/facebook', 
  passport.authenticate('facebook', 
  { scope: [ 'email' ] })
)

router.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    console.log("CALLBACK")
    // Successful authentication, redirect home.
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