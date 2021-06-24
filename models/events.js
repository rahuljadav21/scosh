const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
    name :{
        type : String,
        required : true
    },
    vanue : {
        type :String,
        required : true
    },
    author : {
        type : String,
        required:true
    },
    date :{
       type: Date,
       required:true,
    },
    register :{
           type : String,
           required:true
        }
    
   })
   
   
   module.exports = mongoose.model('Event',EventSchema)