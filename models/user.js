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
  meta :{
    type : String,
    required : true
  },
  session: {
    type: String,
    required: true
  },
  image:{type:ImageSchema},
  
  isAdmin :{
    type : Boolean,
    default : false
  },

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

var options = {
  errorMessages: {
      MissingPasswordError: 'No password was given',
      AttemptTooSoonError: 'Account is currently locked. Try again later',
      TooManyAttemptsError: 'Account locked due to too many failed login attempts',
      NoSaltValueStoredError: 'Authentication not possible. No salt value stored',
      IncorrectPasswordError: 'Password or username are incorrect',
      IncorrectUsernameError: 'Password or username are incorrect',
      MissingUsernameError: 'No username was given',
      UserExistsError: 'A user with the given username is already registered'
  }
};

UserSchema.plugin(passportLocalMongoose,options);
module.exports = mongoose.model('User', UserSchema)