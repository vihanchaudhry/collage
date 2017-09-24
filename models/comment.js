const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({
  text: String,
  user: String,
  post: String,
  date: Date
})

module.exports = mongoose.model('Comment', commentSchema)