const User = require('../modules/user');
const emailverifed = require('../modules/emailverifed');
const sendmail = require('../mail/emailverification');
const sendmailforgotpassword=require('../mail/forgotpassword');
const crypto = require('crypto');

module.exports.emailverifiction = async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });
        if (!user && req.body.password == req.body.Conform_password) {
            const generateToken = () => {
                return crypto.randomBytes(48).toString('hex');
            }
            let token = generateToken();
            let passwordencrpted = crypto.createHash('sha256').update(req.body.password).digest('hex');
            
            emailverifed.create({
                username: req.body.username,
                email: req.body.email,
                password: passwordencrpted,
                token: token,
                tokenExpiry: Date.now() + 120000
            }).then(result => {
                result.save();
                sendmail.verification(result);
            })
            req.flash('success','Email Sent..')
        }else{
            if(user){
                req.flash('error','User Aleredy Created!')
            }
            else{
                req.flash('error','Password unmatch!')
            }
           
        }
        return res.redirect('back');
    } catch(error) {
        console.log("Error in finding user! ", error); 
        return res.redirect('back');
    }
    
}

//semd mail for Reset Password Link
module.exports.sendmail = async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            const generateToken = () => {
                return crypto.randomBytes(48).toString('hex');
            }
            let token = generateToken();
            let users= await emailverifed.findOne({email:req.body.email})
            if(!users){
                emailverifed.create({
                    email: req.body.email,
                    token: token,
                    tokenExpiry: Date.now() + 120000,
                    user: user._id
                }).then(result => {
                    result.save();
                    let use= emailverifed.findOne({email:req.body.email})
                    console.log("Ss",use);
                    sendmailforgotpassword.forgotpassword(use);
                }).catch(err => {
                    console.log(err);
                });
            }else{
                emailverifed.findByIdAndUpdate(users.id,{
                    token: token,
                    tokenExpiry: Date.now() + 120000
                }).then((result) => {
                    console.log("Ss",user);
                    console.log("pp",users);
                    sendmailforgotpassword.forgotpassword(users);       
                }).catch((error) => {
                    console.log(error);
                });
            }
            
        }else{
            req.flash("error","user not found");
            return res.redirect('back');
        }
    } catch (err) {
        req.flash("error","user not found");
        return res.redirect('back');
    }
    req.flash("success","Email Sent..")
    return res.redirect('back');
}