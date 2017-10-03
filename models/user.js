const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')

const userSchema = mongoose.Schema({
  username: String,
  email: String,
  password: String,
  posts: [ String ],
  comments: [ String ]
})

// Generate a hash
userSchema.methods.generateHash = function (password, callback) {
  bcrypt.hash(password, null, null, (err, hash) => {
    if (hash) { return callback(hash) }
})}

// Check if password is valid
userSchema.methods.validPassword = function (password, callback) {
  bcrypt.compare(password, (this.password), (err, result) => {
    if (result) { return callback(result) }
})}

// Handles facebook signups and sign ins
// Returns existing user if found, else creates the user
// and then returns the saved object
userSchema.methods.findOrCreate = async function (facebookProfile) {
  console.log(facebookProfile)
  if (!facebookProfile.email) {
    return null
  }

  // Find user, return if found
  const foundUser = await User.findOne({ email: facebookProfile.email })
  if (foundUser) { return foundUser }

  // Create user because we could not query one
  const newUser = new User()
  newUser.username = facebookProfile.displayName
  newUser.email = facebookProfile.email
  const savedUser = await newUser.save()
  return savedUser
}

// Create the model for users and export it
module.exports = mongoose.model('User', userSchema)