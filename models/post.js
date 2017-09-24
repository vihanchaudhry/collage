const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
  title: String,
  link: String,
  text: String,
  user: String,
  comments: [ String ],
  date: Date
})

module.exports = mongoose.model('Post', postSchema)