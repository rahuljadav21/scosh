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
    res.render('user/register');
})
router.get('/profile',isLoggedIn,async(req,res)=>{
    const user = await req.user
    res.render('user/profile',{user})
})

router.post('/register',upload.single('image'),async(req, res, next) => {
    try 
        {
        const {username,session,linkedIn,insta,facebook,email,bio,password} = req.body;
        const user = new User({username,session,linkedIn,insta,facebook,email,bio});
        if(req.file){
        user.image = {
            url:req.file.path,
            filename:req.file.filename
        }}
        const registeredUser = await User.register(user,password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            res.send(user)
        })
    } 
    catch (e) {
       res.send(e)
    }
})

router.post('/login',passport.authenticate('local'),async(req, res) => {
    try{
    res.send("Logged In");
    }
    catch(e){
        res.send(e);
        console.log(e)
    }
})

router.get('/logout',isLoggedIn,async(req, res) => {
    req.logout();
    res.send("Logged out")
   
})
router.get('/',async(req,res)=>{
    const user = await req.user;
    if(user){
        res.send(user)
    }else{
        res.send("Please LogIn")
    }
    
})

router.put('/edit/:id',isLoggedIn,upload.single('image'),async(req,res)=>{
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
    res.send(user)
} catch (e) {
   res.send(e)
}
})
router.delete('/delete/:id',isLoggedIn,async(req,res)=>{
    const {id} = req.params;
    await User.findByIdAndDelete(id);
    res.send("Account Deleted")
})
module.exports = router;
