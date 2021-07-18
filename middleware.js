module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        return res.send("Please LogIn");
    }
    next();
}

module.exports.isAdmin = async(req,res,next)=>{
    const user = await req.user;
    if(!user.isAdmin){
      return  res.send("You are not authorized to do this action")
    }
    next()
}