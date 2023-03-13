const User = require('../modules/user');
const emailveified = require('../modules/emailverifed');
const crypto = require('crypto')
//When user Succesfull login proile page render
module.exports.loginuser = (req, res) => {
    req.flash('success', 'Logged-In-Successfully');
    return res.redirect('/user/profile');
}
//profile page
module.exports.profile = (req, res) => {
    res.render('profile', {
        title: "Profile page"
    })
}

//Create user in database
module.exports.createuser = async (req, res) => {
    try {
        let user = await emailveified.findOne({ token: req.params.token });
        User.create({
            username: user.username,
            email: user.email,
            password: user.password
        });
        let users = await emailveified.deleteOne({ token: req.params.token });//users delete from database when user create succesfull
        return res.redirect('/')
    } catch (err) {
        if (err) { console.log("Error in finding user! ", err); return; }
    }
    return res.redirect('back');
}

// SingOut
module.exports.signout = (req, res) => {
    
    req.logout(function () {
        req.flash('error', 'Successfull Logout');
        return res.redirect('/');
    });
};

//When user click on Forgotpassword these page render
module.exports.forgotpassword = (req, res) => {
    res.render('forgotpassword', {
        title: "Forgotpassword"
    })
}

//Reset Password
module.exports.Resetpassword = async (req, res) => {
    let useremail = await emailveified.findOne({ user: req.params.id });
    let user = await User.findById(req.params.id);
    if (!useremail) {
        const generateToken = () => {
            return crypto.randomBytes(48).toString('hex');
        }
        let token = generateToken();
        emailveified.create({
            email: user.email,
            token: token,
            tokenExpiry: Date.now() + 1200000000,
            user: user._id
        }).then(result => {
            result.save();
            // resetpassword.deleteOne({ user: req.params.id })
            return res.render("Resetpassword", {
                title: "Reset-Password",
                user: user
            })
        }).catch(err => {
            console.log(err);
        });
    } else {
        const tokenExpiration = useremail.tokenExpiry;
        if (new Date() < tokenExpiration) {
            // resetpassword.deleteOne({ user: req.params.id })
            return res.render("Resetpassword", {
                title: "Reset-Password",
                user: user
            })

        }
        req.flash('error', 'Link has expired');
        return res.redirect('/user/loginpage');
    }


}
// Updatepassword
module.exports.updatepassword = async (req, res) => {
    try {
        if (req.body.password != req.body.conform_password) {
            req.flash('error', 'Password not match');
            return res.redirect('back');
        }
        let passwordencrpted = crypto.createHash('sha256').update(req.body.password).digest('hex');
        //find user in User database
        let user = await User.findByIdAndUpdate(req.params.id, {
            password: passwordencrpted
        });
        const name= await emailveified.findOne({ user:user.id });
        req.flash('success', "Password change sucessful");
        return res.redirect('back');
    } catch (err) {
        console.log("Error in updating password ", err);
    }
}
// Reset new password
module.exports.resetnewpassword = async (req, res) => {
    try {
        let user = await User.findOne({ _id: req.params.id });
        const generateToken = () => {
            return crypto.randomBytes(48).toString('hex');
        }
        let token = generateToken();
        emailveified.create({
            email: user.email,
            token: token,
            tokenExpiry: Date.now() + 120000000,
            user: user.id
        }).then(result => {
            result.save();
            console.log("Ednteref")
            res.redirect(`/user/Resetpassword/${token}`)
        }).catch(err => {
            console.log(err);
        });
    } catch (err) {
        console.log("Error in reset pass: ", err);
    }
    res.redirect('/user/profile')
}


