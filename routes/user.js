const express = require('express');
const User = require('../models/user');
const router = express.Router();
const passport = require('passport');
const {isLoggedIn} = require('../middleware')
const multer = require('multer')
const { storage } = require('../cloudinary');
const upload =  multer({ storage });
const { cloudinary } = require("../cloudinary");

router.get('/register',(req, res) => {
    res.render('register');
})
router.get('/profile',isLoggedIn,async(req,res)=>{
    const user = await req.user
    res.render('profile',{user})
})

router.post('/register',upload.single('image'),async(req, res, next) => {
    try 
        {
        const {username,session,linkedIn,insta,facebook,email,bio,password} = req.body;
        const user = new User({username,session,linkedIn,insta,facebook,email,bio});
        user.image = {
            url:req.file.path,
            filename:req.file.filename
        }
        const registeredUser = await User.register(user,password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            res.redirect('/');
        })
    } 
    catch (e) {
        console.log(e)
        res.redirect('register');
    }
})

router.get('/login',(req, res) => {
    res.render('login');
})

router.post('/login',passport.authenticate('local', {  failureRedirect: '/' }),async(req, res) => {
    
    const redirectUrl = req.session.returnTo || '/profile';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

router.get('/logout',isLoggedIn,async(req, res) => {
    req.logout();
    // req.session.destroy();
    res.redirect('/');
})

router.get('/edit/:id',isLoggedIn,async(req,res)=>{
    const user = await req.user;
    const {id} = req.params
    res.render('edit',{user,id})
})
router.put('/edit/:id',upload.single('image'),async(req,res)=>{
    try{     
    const {id} = req.params;
    const {username,session,linkedIn,insta,facebook,email,bio} = req.body;
    const user = await User.findByIdAndUpdate(id,{username,session,linkedIn,insta,facebook,email,bio});
    
    if(req.file){
        await cloudinary.uploader.destroy(user.image);
        user.image = {
            url:req.file.path,
            filename:req.file.filename
        }
     }
    await user.save();
    res.redirect('/profile')
} catch (e) {
    console.log(e)
    res.redirect('/profile');
}
})
router.delete('/delete/:id',isLoggedIn,async(req,res)=>{
    const {id} = req.params;
    await User.findByIdAndDelete(id);
    res.redirect('/')
})
module.exports = router;
