const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose');

const ImageSchema = new mongoose.Schema({
  url: String,
  filename: String
});
ImageSchema.virtual('thumbnail').get(function () {
  return this.url.replace('/upload', '/upload/w_200');
});
const opts = { toJSON: { virtuals: true } };
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  session: {
    type: String,
    required: true
  },
  image:{type:ImageSchema},

  linkedIn: {
    type: String
  },
  insta: {
    type: String
  },
  facebook: {
    type: String
  },
  email: {
    type: String
  },
  bio: {
    type: String,
    required: true
  }
},opts)

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', UserSchema)