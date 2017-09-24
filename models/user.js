const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')

const userSchema = mongoose.Schema({
  email: String,
  password: String
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

// Create the model for users and export it
module.exports = mongoose.model('User', userSchema)