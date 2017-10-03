const express = require('express')
const exphbs  = require('express-handlebars');
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const User = require('./models/user')
const routes = require('./routes')
const users = require('./routes/users')
const posts = require('./routes/posts')
const comments = require('./routes/comments')

const FACEBOOK_APP_ID = '841552106019676'
const FACEBOOK_APP_SECRET = '24e9cc4a447b3c6e5510e84ec6f2bc0e'

// Connect to mongodb
mongoose.connect('mongodb://localhost:27017/db', { useMongoClient: true, promiseLibrary: global.Promise })

// Configure the local strategy for use by passport.
passport.use(new LocalStrategy(async (username, password, callback) => {
  const user = await User.findOne({ username: username })
    if (!user) { return callback(null, false) }
    user.validPassword(password, (result => {
      if (!result) { return callback(null, false) }
      return callback(null, user)      
    }))
}))

// Configure the facebook strategy for use by passport
passport.use(new FacebookStrategy({
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  callbackURL: 'http://localhost:3000/auth/facebook/callback',
  profileFields: [ 'email' ]
}, async (accessToken, refreshToken, profile, callback) => {
  let user = new User()
  user = await user.findOrCreate({ 
    email: profile.email
  })
  console.log(user)
  return callback(null, user)
}))

// Configure passport authenticated session persistence methods
passport.serializeUser((user, callback) => {
  callback(null, user._id)
})

passport.deserializeUser(async (id, callback) => {
  const user = await User.findById(id)
    callback(null, user)
})

// Handlebars
app.engine('handlebars', exphbs({ 
  defaultLayout: 'main',
  partialsDir: [ 'views/partials/' ]
}))
app.set('view engine', 'handlebars');

// Serve static files from public/
app.use(express.static('public'))

// Express app middleware
app.use(require('morgan')('combined'))
app.use(require('cookie-parser')())
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