const express = require('express');

const Blog = require('../models/blog');
const router = express.Router();
const {isLoggedIn,isAdmin} = require('../middleware')
const multer = require('multer')
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const { cloudinary } = require("../cloudinary");


router.get('/', async (req, res) => {
   try{
   let {page} = req.query;
   if(!page){
      page = 1;
   }
   const b = await Blog.find({});
   const blogs = b.reverse().slice((page-1)*8,page*8);
   res.send(blogs)}
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

router.post('/',isLoggedIn,isAdmin,upload.array('images'),async (req, res) => {
   try{
      const blog = new Blog({
         title: req.body.title,
         content: req.body.content,
         author: req.body.author
      })
      if(req.files){ 
      blog.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
      }
      await blog.save();
      res.send(blog)
   }catch(e){
      res.send(e)
   }
   
})

router.get('/:id',async (req, res) => {
   try{
   const { id } = req.params;
   const blog = await Blog.findById(id);
   res.send(blog)}
   catch(e){
      res.send(e)
   }
})

router.get('/edit/:id',isLoggedIn,isAdmin,async (req, res) => {
   try{ 
   const { id } = req.params;
   const blog = await Blog.findById(id);
   res.send(blog)}
   catch(e){
      res.send(e)
   }
})
router.put('/edit/:id',isLoggedIn,isAdmin,upload.array('images'),async (req, res) => {
   try{
   const { id } = req.params;
   const blog = await Blog.findByIdAndUpdate(id, {
      title: req.body.title,
      content: req.body.content,
      author: req.body.author
   })
   if(req.files){
      const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
      blog.images.push(...imgs);
      await blog.save()
      if (req.body.deleteImages) {
         for (let filename of req.body.deleteImages) {
             await cloudinary.uploader.destroy(filename);
         }
         await blog.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
     }

   }
   await blog.save()
  
  res.send(blog)}
  catch(e){
   res.send(e)
}
})
router.delete('/delete/:id',isLoggedIn,isAdmin,async(req,res)=>{
   try{
   const {id} =req.params 
   await Blog.findByIdAndDelete(id);}
   catch(e){
      res.send(e)
   }
})
module.exports = router;