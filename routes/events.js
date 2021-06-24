const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../middleware')
const Event = require('../models/events');

router.get('/', async (req, res) => {
    const events = await Event.find({});
    res.render('event/index', { events })
 })
 
 router.get('/new',isLoggedIn,async (req, res) => {
    res.render('event/new')
 })
 
 router.post('/',isLoggedIn,async (req, res) => {
    const event = new Event({
       name: req.body.name,
       vanue: req.body.vanue,
       author: req.body.author,
       date :req.body.date,
       register : req.body.register 
      
    })
    await event.save()
    res.redirect(`/events/${event._id}`)
 })
 
 router.get('/:id',async (req, res) => {
    const { id } = req.params;
    const event = await Event.findById(id);
    res.render('event/show', {event});
 })
 
 router.get('/edit/:id',isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const event = await Event.findById(id);
    res.render('event/update', { id, event })
 })
 router.put('/edit/:id',isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const event = await Event.findByIdAndUpdate(id, {
      name: req.body.name,
       vanue: req.body.vanue,
       author: req.body.author,
       date :req.body.date,
       register : req.body.register 
    })
    await event.save()
 
   res.redirect(`/events/${id}`)
 })
 router.delete('/delete/:id',isLoggedIn,async(req,res)=>{
    const {id} =req.params 
    await Event.findByIdAndDelete(id);
    res.redirect('/events')
 })

module.exports = router;