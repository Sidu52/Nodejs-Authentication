const express= require('express');
const routes = express.Router();

const emailcontroller= require('../controllers/emailcontroller');

routes.post('/emailverification',emailcontroller.emailverifiction);
routes.post('/sendmail',emailcontroller.sendmail);

module.exports=routes  