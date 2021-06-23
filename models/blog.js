const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

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
})


module.exports = mongoose.model('Blog',BlogSchema)