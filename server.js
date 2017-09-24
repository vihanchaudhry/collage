const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('./models/user')
const routes = require('./routes')
const users = require('./routes/users')
const posts = require('./routes/posts')
const comments = require('./routes/comments')

// Connect to mongodb
mongoose.connect('mongodb://localhost:27017/db', { useMongoClient: true, promiseLibrary: global.Promise })

// Configure the local strategy for use by Passport.
passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, callback) => {
  User.findOne({ email: email }, (err, user) => {
    if (err) { return callback(err, null) }
    if (!user) { return callback(null, false) }
    user.validPassword(password, (result => {
      if (!result) { return callback(null, false) }
      return callback(null, user)      
    }))
  })
}))

// Configure Passport authenticated session persistence.
passport.serializeUser((user, callback) => {
  callback(null, user._id)
})

passport.deserializeUser((id, callback) => {
  User.findById(id, (err, user) => {
    if (err) { return callback(err) }
    callback(null, user)
  })
})

// Set view engine
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

// Serve static files from public/
app.use(express.static('public'))

// Express app middleware
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }))

// Initialize Passport and restore authentication state
app.use(passport.initialize())
app.use(passport.session())

app.use('/', routes)
app.use('/users', users)
app.use('/posts', posts)
app.use('/', comments)

// Start the server
app.listen(3000, () => {
  console.log('Listening on 3000')
})