const express = require('express');

const Blog = require('../models/blog');
const router = express.Router();
const {isLoggedIn} = require('../middleware')
const multer = require('multer')
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const { cloudinary } = require("../cloudinary");




router.get('/', async (req, res) => {
   const blogs = await Blog.find({});
   res.render('blog/blog', { blogs })
})

router.get('/new',isLoggedIn,async (req, res) => {
   res.render('blog/new')
})

router.post('/', upload.array('images'), isLoggedIn,async (req, res) => {
   const blog = new Blog({
      title: req.body.title,
      content: req.body.content,
      author: req.body.author
   })
   blog.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
   await blog.save();
   res.redirect(`/blogs/${blog._id}`)
})

router.get('/:id',async (req, res) => {
   const { id } = req.params;
   const blog = await Blog.findById(id);
   res.render('blog/show', { blog });
})

router.get('/edit/:id',isLoggedIn, async (req, res) => {
   const { id } = req.params;
   const blog = await Blog.findById(id);
   res.render('blog/update', { id, blog })
})
router.put('/edit/:id', upload.array('images'),isLoggedIn, async (req, res) => {
   const { id } = req.params;
   const blog = await Blog.findByIdAndUpdate(id, {
      title: req.body.title,
      content: req.body.content,
      author: req.body.author
   })
   const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
   blog.images.push(...imgs);
   await blog.save()
   if (req.body.deleteImages) {
      for (let filename of req.body.deleteImages) {
          await cloudinary.uploader.destroy(filename);
      }
      await blog.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
  }
  res.redirect(`/blogs/${id}`)
})
router.delete('/delete/:id',isLoggedIn,async(req,res)=>{
   const {id} =req.params 
   await Blog.findByIdAndDelete(id);
   res.redirect('/blogs')
})
module.exports = router;