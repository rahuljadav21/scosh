const express = require('express');
const router = express.Router();
const Blog = require('../models/blog');

router.get('/',async(req,res)=>{
 const blogs = await Blog.find({});
 res.send(blogs)
})

router.post('/',async(req,res)=>{
 const blog = new Blog({
    title : req.body.title,
    content : req.body.content,
 })
blog.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
blog.author = req.user._id
await blog.save();

})