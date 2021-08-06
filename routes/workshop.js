const express = require('express');
const router = express.Router();
const {isLoggedIn,isAdmin} = require('../middleware')
const Workshop = require('../models/workshop');

router.get('/', async (req, res) => {
   try{
   let {page} = req.query;
   if(!page){
      page = 1;
   }
   const w = await Workshop.find({});
   const workshops = w.reverse().slice((page-1)*8,page*8);
   res.send(workshops)}
   catch(e){
      res.send(e)
   }
})

router.get('/recent', async (req, res) => {
   try{
   const blogs = await Blog.find({});

   const recent_blogs = blogs.sort(function(){
      return new Date().now - new Date(100000000000);
    }).reverse().slice(0,5);
   res.send(recent_blogs)}
   catch(e){
      res.send(e)
   }
})

 router.post('/',isLoggedIn,isAdmin,async (req, res) => {
   try{
      const workshop = new Workshop({
         name: req.body.name,
         vanue: req.body.vanue,
         author: req.body.author,
         description:req.body.description,
         date :req.body.date,
         register : req.body.register 
        
      })
      await workshop.save()
      res.send(workshop)
   }
   catch(e){
      res.send(e)
   }
  
 })
 
 router.get('/:id',async(req, res) => {
   try{
      const { id } = req.params;
      const workshop = await Workshop.findById(id);
      res.send(workshop)
   }
   catch(e){
      res.send(e)
   }   
 })

 router.put('/edit/:id',isLoggedIn,isAdmin,async (req, res) => {
   try{
      const { id } = req.params;
      const workshop = await Workshop.findByIdAndUpdate(id, {
        name: req.body.name,
         vanue: req.body.vanue,
         author: req.body.author,
         description:req.body.description,
         date :req.body.date,
         register : req.body.register 
      })
      await workshop.save()
     res.send(workshop)
   }
   catch(e){
      res.send(e)
   }
 
 })
 router.delete('/delete/:id',isLoggedIn,isAdmin,async(req,res)=>{
   try{
      const {id} =req.params 
      await Workshop.findByIdAndDelete(id);
      res.send("WorkShop Deleted")
   }
   catch(e){
      res.send(e)
   }   
 })

module.exports = router;