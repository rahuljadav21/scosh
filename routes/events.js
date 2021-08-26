const express = require('express');
const router = express.Router();
const Event = require('../models/events');
const multer = require('multer')
const { storage } = require('../cloudinary');
const upload =  multer({ storage });
const { cloudinary } = require("../cloudinary");

router.get('/', async (req, res) => {
   try{
   let {page} = req.query
   if(!page){
      page = 1;
   }
   const e = await Event.find({});
   const events = e.reverse().slice((page-1)*8,page*8);
   res.send(events)}
   catch(e){
      res.send(e)
   }
})

router.get('/recent', async (req, res) => {
   try{
   const events = await Blog.find({});

   const recent_events = events.sort(function(){
      return new Date().now - new Date(100000000000);
    }).reverse().slice(0,5);
   res.send(recent_events)}
   catch(e){
      res.send(e)
   }
})
 
 router.post('/',upload.single('image'),async(req, res) => {
   try{
      const event = new Event({
         name: req.body.name,
         description : req.body.description,
         register : req.body.register 
        
      })
      if(req.file){
         event.image = {
             url:req.file.path,
             filename:req.file.filename
         }}
      await event.save()
      res.send(event)

   }
   catch(e){
      res.send(e)
   }
 })
 
 router.get('/:id',async (req, res) => {
   try{
      const { id } = req.params;
      const event = await Event.findById(id);
      res.send(event)
   }
   catch(e){
      res.send(e)
   }
 })

 router.put('/edit/:id',upload.single('image'),async (req, res) => {
   try{
      const { id } = req.params;
      const event = await Event.findByIdAndUpdate(id, {
        name: req.body.name,
        description : req.body.description,
        register : req.body.register 
      })
      if(req.file){
         await cloudinary.uploader.destroy(event.image);
         event.image = {
             url:req.file.path,
             filename:req.file.filename
         }
      }
      await event.save()
      res.send(event)
   }
   catch(e){
      res.send(e)
   }
 })
 router.delete('/delete/:id',async(req,res)=>{
   try{
      const {id} =req.params 
      await Event.findByIdAndDelete(id);
      res.send("Event Deleted")
   }
   catch(e){
      res.send(e)
   }
 })

module.exports = router;