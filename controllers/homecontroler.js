const { title } = require("process")

module.exports.login=(req,res)=>{
    res.render('login',{
        title:"Userlogin"
    });
}
module.exports.singup=(req,res)=>{
    res.render('singup',{
        title:"Create Acc.."
    });
}