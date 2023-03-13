const express= require('express');
const routes= express.Router();

routes.use('/user',require('./user'));
routes.use('/email',require('./email'));

const homecontroller=require('../controllers/homecontroler');

routes.get('/',homecontroller.login);
routes.get('/singup',homecontroller.singup);

module.exports=routes
