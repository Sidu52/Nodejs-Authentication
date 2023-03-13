// const nodemailer =require('nodemailer')
const nodemailer=require('../sendmailer/nodemailer');

exports.verification= (user)=>{
    let htmlString= nodemailer.renderTemplate({user:user},'/emailveified/email.ejs');
    nodemailer.transporter.sendMail({
        from: 'alstonsid9@gmail.com',
        to:user.email,
        subject: "Email verification",
        html: htmlString
    }, (err, info) => {
        if (err) { console.log("Error in sending mail ", err); return; }
        console.log('Message sent', info)
    });
}