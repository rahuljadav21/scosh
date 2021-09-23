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

const EventSchema = new Schema({
    name :{
        type : String,
        required : true
    },
    meta :{
      type : String,
      required : true
    },
    isOver :{
      type : Boolean,
    },

    description :{
        type : String,
        required : true
    },
    thumbnail:{type:ImageSchema},
    image:{type:ImageSchema},
    register :{
           type : String,
           required:true
        }
    
   },opts)
   
   
   module.exports = mongoose.model('Event',EventSchema)