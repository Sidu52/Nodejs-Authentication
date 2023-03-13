const express = require('express');
const app = express();
const port = 8000;
const EJSLayout=require('express-ejs-layouts');
const db= require('./config/mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const passportLocal = require('./config/passport-local-streegy');
const passportGoogle=require('./config/passport-google-oauth2-strategy');
const session=require('express-session')
const customMware=require('./config/middleware');
const MongoStore=require('connect-mongo')(session);

// Express middleware that is used to parse form data in an Express application
app.use(express.urlencoded())
app.use(express.static('./assest'));
// the view engine and the path where the views are located.
app.use(EJSLayout);
app.set('view engine','ejs');
app.set('views','./views')
// Use flash middleware
// app.use(flash());

// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// Make Session authenticate
app.use(session({
    name:"Alston",
    secret:'sidhualston',
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge: (1000 * 60 * 100)
    }
    ,store: new MongoStore({
        mongooseConnection:db,
        autoRemove:'disabled'
    },
    (err=>{
        console.log(err || "connect mongodb setup ok")
    })
    )
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser)

app.use(flash());
app.use(customMware.setFlash);
//Setip routes path
app.use('/',require('./routes/index'))

//Setup our server on port number 8000
app.listen(port,(err)=>{
    if(err){console.log("Error in Starting Server! ",err);return}
    console.log("Server Start Sucessfull for Port ",port);
})