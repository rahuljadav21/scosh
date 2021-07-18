const express = require('express');
const router = express.Router();
const {isLoggedIn,isAdmin} = require('../middleware')
const Event = require('../models/events');

router.get('/', async (req, res) => {
   try{
      const events = await Event.find({});
      res.send(events)     
   }
   catch(e){
      res.send(e)
   }
 })
 
 router.post('/',isLoggedIn,isAdmin,async (req, res) => {
   try{
      const event = new Event({
         name: req.body.name,
         vanue: req.body.vanue,
         author: req.body.author,
         date :req.body.date,
         register : req.body.register 
        
      })
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

 router.put('/edit/:id',isLoggedIn,isAdmin,async (req, res) => {
   try{
      const { id } = req.params;
      const event = await Event.findByIdAndUpdate(id, {
        name: req.body.name,
         vanue: req.body.vanue,
         author: req.body.author,
         date :req.body.date,
         register : req.body.register 
      })
      await event.save()
      res.send(event)
   }
   catch(e){
      res.send(e)
   }
 })
 router.delete('/delete/:id',isLoggedIn,isAdmin,async(req,res)=>{
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