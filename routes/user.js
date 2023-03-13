const express= require('express');
const passport=require('passport');
const routes = express.Router();

const usercontroller= require('../controllers/usercontroller');

routes.use('/loginpage',passport.authenticate(
    'local',
    {failureRedirect:'/'},
),usercontroller.loginuser)
routes.get('/createuser/:token',usercontroller.createuser);
routes.get('/profile',passport.checkAuthentication,usercontroller.profile);
routes.post('/updatepassword/:id',usercontroller.updatepassword);
routes.get('/singout',passport.checkAuthentication,usercontroller.signout);
routes.get('/forgotpassword',usercontroller.forgotpassword);
routes.get('/Resetpassword/:id',usercontroller.Resetpassword);
routes.get('/resetnewpassword/:id',usercontroller.resetnewpassword);

routes.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}));
routes.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/'}),usercontroller.loginuser)

module.exports=routes