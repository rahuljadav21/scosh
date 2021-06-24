const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
  });
const opts = { toJSON: { virtuals: true } };
const BlogSchema = new Schema({
 title :{
     type : String,
     required : true
 },
 content : {
     type :String,
     required : true
 },
 author :{
     type : String,
     required:true
 },
 createdAt :{
    type: Date,
    default: Date.now,
 },
 images :[ImageSchema]
},opts)


module.exports = mongoose.model('Blog',BlogSchema)