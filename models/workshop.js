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

const WorkShopSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    isOver :{
      type : Boolean,
    },

    meta :{
      type : String,
    },
    description: {
        type: String,
        required: true
    },
    image:{type:ImageSchema},
    register :{
        type : String,
        required:true
     }
},opts)


module.exports = mongoose.model('WorkShop', WorkShopSchema)