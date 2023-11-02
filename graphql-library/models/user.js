const { Schema, model } = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    minlength: 3
  },
  favoriteGenre: String
})

module.exports = model('User', userSchema)