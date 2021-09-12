const express = require('express');

const Blog = require('../models/blog');
const router = express.Router();
const multer = require('multer')
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const { cloudinary } = require("../cloudinary");

//APIs for EJS Rendering
router.get('/ejs', async (req, res) => {
   const blogs = await Blog.find({});
   res.render('blog/blog', { blogs })
})

router.get('/ejs/new',async (req, res) => {
   res.render('blog/new')
})
router.post('/ejs',upload.array('images'),async (req, res) => {
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
      res.redirect(`/blogs/ejs/`)
   }catch(e){
      res.send(e)
   }
   
})
router.get('/ejs/:id',async(req,res)=>{
   const { id } = req.params;
   const blog = await Blog.findById(id);
   res.render('blog/show',{blog})
})
router.get('/ejs/edit/:id',async(req,res)=>{
   const { id } = req.params;
   const blog = await Blog.findById(id);
   res.render('blog/update',{blog});
})
router.put('/ejs/edit/:id',upload.array('images'),async (req, res) => {
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
  
  res.redirect(`/blogs/ejs/${id}`)}
  catch(e){
   res.send(e)
}
})
router.delete('/ejs/delete/:id',async(req,res)=>{
   try{
   const {id} =req.params 
   await Blog.findByIdAndDelete(id);
   res.redirect(`/blogs/ejs`)
}
   catch(e){
      res.send(e)
   }
})


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

router.get('/:id',async (req, res) => {
   try{
   const { id } = req.params;
   const blog = await Blog.findById(id);
   res.send(blog)}
   catch(e){
      res.send(e)
   }
})

// *******************************************Use Commented apis with frontend otherthan ejs*****************************

// router.post('/',upload.array('images'),async (req, res) => {
//    try{
//       const blog = new Blog({
//          title: req.body.title,
//          content: req.body.content,
//          author: req.body.author,

//       })
//       if(req.files){ 
//       blog.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
//       }
//       await blog.save();
//       res.send(blog)
//    }catch(e){
//       res.send(e)
//    }
   
// })

// router.put('/edit/:id',upload.array('images'),async (req, res) => {
//    try{
//    const { id } = req.params;
//    const blog = await Blog.findByIdAndUpdate(id, {
//       title: req.body.title,
//       content: req.body.content,
//       author: req.body.author,


//    })
//    if(req.files){
//       const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
//       blog.images.push(...imgs);
//       await blog.save()
//       if (req.body.deleteImages) {
//          for (let filename of req.body.deleteImages) {
//              await cloudinary.uploader.destroy(filename);
//          }
//          await blog.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
//      }

//    }
//    await blog.save()
  
//   res.send(blog)}
//   catch(e){
//    res.send(e)
// }
// })
// router.delete('/delete/:id',async(req,res)=>{
//    try{
//    const {id} =req.params 
//    await Blog.findByIdAndDelete(id);}
//    catch(e){
//       res.send(e)
//    }
// })
module.exports = router;