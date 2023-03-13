const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../modules/user');
const crypto=require('crypto');

passport.use(new LocalStrategy({
    usernameField:'email',
    passReqToCallback:true
},
 (req,email,password,done)=>{
    User.findOne({email:email},(err,user)=>{
        if(err){
            return done(err);
        }
        let passwordencrpted = crypto.createHash('sha256').update(password).digest('hex');
        if(!user || user.password != passwordencrpted){
            req.flash('error','Invalid Email/Password')
            return done(null, false)
        }
        return done(null,user);
    });
 }

));

// Serializing the user to decide which key is to be kept in the cookie
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

// desseruaizing the user from the key in the cookies
passport.deserializeUser(function (id, done) {
    User.findById(id, (err, user) => {
        if (err) {
            console.log("Error in finding user")
            return done(err);
        }
        return done(null, user);
    })
});


// check if user is authenticated
passport.checkAuthentication=(req,res,next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    // if the user is not signed in
    return res.redirect('/');
}
passport.setAuthenticatedUser=(req,res,next)=>{
    if(req.isAuthenticated()){
        res.locals.user=req.user;
    }
    next();
}
module.exports=passport;