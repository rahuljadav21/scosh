const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new mongoose.Schema({
    url: String,
    filename: String
  });
  ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
  });
const opts = { toJSON: { virtuals: true } };
const memberSchema = new Schema({
    name : {
        type : String,
        required :true
    },
    year: {
        type : Number,
        required :true
    }
    ,
    designation : {
        type :String,
        required :true
    },
    image:{type:ImageSchema},
    facebook :{
        type :String,
    },
    linkedin :{
        type :String,
    },
    insta :{
        type :String,
    },
    twitter :{
        type :String,
    },

},opts)

   
module.exports = mongoose.model('Member',memberSchema)