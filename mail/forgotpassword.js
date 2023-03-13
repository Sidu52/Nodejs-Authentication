// const nodemailer =require('nodemailer')
const nodemailer=require('../sendmailer/nodemailer');

exports.forgotpassword= (user)=>{
    let htmlString= nodemailer.renderTemplate({user:user},'/forgotpassword/forgotpasswordemail.ejs');
    nodemailer.transporter.sendMail({
        from: 'alstonsid9@gmail.com',
        to:user.email,
        subject: "Forgot Password",
        html: htmlString
    }, (err, info) => {
        if (err) { console.log("Error in sending mail ", err); return; }
        console.log('Message sent', info)
    });
}