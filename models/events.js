const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user')

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
    time :{
       type: Date,
       default: Date.now,
    },
    registered :[
        {
           type : Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
   })
   
   
   module.exports = mongoose.model('Event',EventSchema)