const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../middleware')
const Workshop = require('../models/workshop');

router.get('/', async (req, res) => {
    const workshops = await Workshop.find({});
    res.render('workshop/index', { workshops })
 })
 
 router.get('/new',isLoggedIn,async (req, res) => {
    res.render('workshop/new')
 })
 
 router.post('/',isLoggedIn,async (req, res) => {
    const workshop = new Workshop({
       name: req.body.name,
       vanue: req.body.vanue,
       author: req.body.author,
       description:req.body.description,
       date :req.body.date,
       register : req.body.register 
      
    })
    await workshop.save()
    res.redirect(`/workshops/${workshop._id}`)
 })
 
 router.get('/:id',async(req, res) => {
    const { id } = req.params;
    const workshop = await Workshop.findById(id);
    res.render('workshop/show', {workshop});
 })
 
 router.get('/edit/:id',isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const workshop = await Workshop.findById(id);
    res.render('workshop/update', { id, workshop })
 })
 router.put('/edit/:id',isLoggedIn, async (req, res) => {
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
 
   res.redirect(`/workshops/${id}`)
 })
 router.delete('/delete/:id',isLoggedIn,async(req,res)=>{
    const {id} =req.params 
    await Workshop.findByIdAndDelete(id);
    res.redirect('/workshops')
 })

module.exports = router;