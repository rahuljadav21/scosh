const express = require('express');
const Member = require('../models/team')
const router = express.Router();
const multer = require('multer')
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const { cloudinary } = require("../cloudinary");

//ejs routes
router.get('/ejs', async (req, res) => {
   const members = await Member.find({});
   res.render('team/member', { members })
})
router.get('/ejs/yearwise', async (req, res) => {
   const {y}= req.query;
   const members = await Member.find({year : y});
   res.render('team/member', { members })
})

router.get('/ejs/new',async (req, res) => {
   res.render('team/new')
})
router.post('/ejs',upload.single('image'),async(req, res) => {
   try{
      const member = new Member({
         name : req.body.name,
         year : req.body.year,
         designation : req.body.designation,
         facebook : req.body.facebook,
         insta : req.body.insta,
         linkedin : req.body.linkedin,
         twitter : req.body.twitter
      })
      if(req.file){
       member.image = {
           url:req.file.path,
           filename:req.file.filename
          }
       }
       await member.save()
      res.redirect(`/teams/ejs`)

   }
   catch(e){
      res.send(e)
   }
 })
 
router.get('/ejs/:id',async(req,res)=>{
   const { id } = req.params;
   const member = await Member.findById(id);
   res.render('team/show',{member})
})
router.get('/ejs/edit/:id',async(req,res)=>{
   const { id } = req.params;
   const member = await Member.findById(id);
   res.render('team/update',{member});
})
router.put('/ejs/edit/:id',upload.single('image'),async (req, res) => {
   try{
      const { id } = req.params;
      const member = await Member.findByIdAndUpdate(id,{
         name : req.body.name,
         year : req.body.year,
         designation : req.body.designation,
         facebook : req.body.facebook,
         insta : req.body.insta,
         linkedin : req.body.linkedin,
         twitter : req.body.twitter
      })
      if(req.file){
         await cloudinary.uploader.destroy(member.image)
       member.image = {
           url:req.file.path,
           filename:req.file.filename
          }
       }
       await member.save()
      res.redirect(`/teams/ejs/${id}`)
   }
   catch(e){
      res.send(e)
   }
 })
 router.delete('/ejs/delete/:id',async(req,res)=>{
   try{
      const {id} =req.params 
      await Member.findByIdAndDelete(id);
      res.redirect(`/teams/ejs`)
   }
   catch(e){
      res.send(e)
   }
 })

//back-end routes
router.get('/',async(req,res)=>{
    try{
        
        const member = await Member.find({});
        res.send(member)
     }
     catch(e){
        res.send(e)
     }   
})
router.get('/yearwise',async(req,res)=>{
    try{
        const {y}= req.query;
        const member = await Member.find({year : y});
        res.send(member)
     }
     catch(e){
        res.send(e)
     } 
})
router.post('/',upload.single('image'),async(req,res)=>{
    try{
       const member = new Member({
          name : req.body.name,
          year : req.body.year,
          designation : req.body.designation,
          facebook : req.body.facebook,
          insta : req.body.insta,
          linkedin : req.body.linkedin,
          twitter : req.body.twitter
       })
       if(req.file){
        member.image = {
            url:req.file.path,
            filename:req.file.filename
           }
        }
        await member.save()
        res.send(member)
     }
    
     catch(e){
        res.send(e)
     } 
})
router.put('/:id',upload.single('image'),async(req,res)=>{
    try{
       const {id} =req.params
       const member = await Member.findByIdAndUpdate(id,{
          name : req.body.name,
          year : req.body.year,
          designation : req.body.designation,
          facebook : req.body.facebook,
          insta : req.body.insta,
          linkedin : req.body.linkedin,
          twitter : req.body.twitter
       })
       if(req.file){
        await cloudinary.uploader.destroy(member.image)
        member.image = {
            url:req.file.path,
            filename:req.file.filename
           }
        }
        await member.save()
        res.send(member)
     }
    
     catch(e){
        res.send(e)
     } 
})
router.delete('/:id',async(req,res)=>{
    const {id} =req.params;
    await Member.findByIdAndDelete(id)
    res.send("Member Deleted");
})
module.exports = router;