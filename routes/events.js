const express = require('express');
const router = express.Router();
const Event = require('../models/events');
const multer = require('multer')
const { storage } = require('../cloudinary');
const upload =  multer({ storage });
const { cloudinary } = require("../cloudinary");

//APIs for EJS Rendering
router.get('/ejs', async (req, res) => {
   const events = await Event.find({});
   res.render('event/event', { events })
})

router.get('/ejs/new',async (req, res) => {
   res.render('event/new')
})
router.post('/ejs',upload.single('image'),async(req, res) => {
   try{
      let isOver;
      if(req.body.isOver){
         isOver = true;
      }else{isOver=false}
      
      const event = new Event({
         name: req.body.name,
         description : req.body.description,
         register : req.body.register,
         meta : req.body.meta,
         isOver : isOver         
      })
      if(req.file){
         event.image = {
             url:req.file.path,
             filename:req.file.filename
         }}
      await event.save()
      res.redirect(`/events/ejs`)

   }
   catch(e){
      res.send(e)
   }
 })
 
router.get('/ejs/:id',async(req,res)=>{
   const { id } = req.params;
   const event = await Event.findById(id);
   res.render('event/show',{event})
})
router.get('/ejs/edit/:id',async(req,res)=>{
   const { id } = req.params;
   const event = await Event.findById(id);
   res.render('event/update',{event});
})
router.put('/ejs/edit/:id',upload.single('image'),async (req, res) => {
   try{
      let isOver;
      if(req.body.isOver){
         isOver = true;
      }else{isOver=false}

      const { id } = req.params;
      const event = await Event.findByIdAndUpdate(id, {
        name: req.body.name,
        description : req.body.description,
        register : req.body.register,
        meta : req.body.meta,
        isOver :  isOver
      })
      if(req.file){
         await cloudinary.uploader.destroy(event.image);
         event.image = {
             url:req.file.path,
             filename:req.file.filename
         }
      }
      await event.save()
      res.redirect(`/events/ejs/${id}`)
   }
   catch(e){
      res.send(e)
   }
 })
 router.delete('/ejs/delete/:id',async(req,res)=>{
   try{
      const {id} =req.params 
      await Event.findByIdAndDelete(id);
      res.redirect(`/events/ejs`)
   }
   catch(e){
      res.send(e)
   }
 })

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
   const events = await event.find({});

   const recent_events = events.sort(function(){
      return new Date().now - new Date(100000000000);
    }).reverse().slice(0,5);
   res.send(recent_events)}
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
 //*******************************************Use Commented apis with frontend otherthan ejs*****************************
//  router.post('/',upload.single('image'),async(req, res) => {
//    try{
//       const event = new Event({
//          name: req.body.name,
//          description : req.body.description,
//          register : req.body.register,
//          meta : req.body.meta 
        
//       })
//       if(req.file){
//          event.image = {
//              url:req.file.path,
//              filename:req.file.filename
//          }}
//       await event.save()
//       res.send(event)

//    }
//    catch(e){
//       res.send(e)
//    }
//  })
 


//  router.put('/edit/:id',upload.single('image'),async (req, res) => {
//    try{
//       const { id } = req.params;
//       const event = await Event.findByIdAndUpdate(id, {
//         name: req.body.name,
//         description : req.body.description,
//         register : req.body.register,
//         meta : req.body.meta
//       })
//       if(req.file){
//          await cloudinary.uploader.destroy(event.image);
//          event.image = {
//              url:req.file.path,
//              filename:req.file.filename
//          }
//       }
//       await event.save()
//       res.send(event)
//    }
//    catch(e){
//       res.send(e)
//    }
//  })
//  router.delete('/delete/:id',async(req,res)=>{
//    try{
//       const {id} =req.params 
//       await Event.findByIdAndDelete(id);
//       res.send("Event Deleted")
//    }
//    catch(e){
//       res.send(e)
//    }
//  })

module.exports = router;