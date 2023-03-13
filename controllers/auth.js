const User = require('../models/User');
const jwt = require('jsonwebtoken');
const mailgun = require("mailgun-js");
const DOMAIN = process.env.DOMAIN;
const mg = mailgun({apiKey: process.env.MAILGUN_APIKEY, domain: DOMAIN});

//to activate your account 
exports.activateAccount = async (req, res, next) => {
    try {
        const {token} = req.body; 
        if(token){
            jwt.verify(token, process.env.JWT, function(err,decodeToken){
                if(err){
                    return res.status(400).json({error: 'Incoreect or Expired link.'})
                }
                const {name, email, password} = decodeToken;
                User.findOne({email}).then((err, user) => {
                    if(user){
                        return res.status(400).json({error:'User with this email alreday exists.'});
                    }
                    let newUser = new User({name, email, password});
                    newUser.save()
                    })
                })
        } else {
            return res.json({error: 'Something went wrong'})
        }
    }catch(err){
        next(err)
    }
}

// create user without email account verification
// to register the user
exports.signup = async(req,res,next)=> {
    try {
        const {name, password, email} = req.body
        User.findOne({email}).then((err, user) => {
            if(user) {
                return res.status(400).json({error: "User with this email already exists."});
            }

            const token = jwt.sign({name,email,password}, process.env.JWT, {expiresIn: '20m'})

            const data = {
                from: 'noreply@yopmail.com',
                to: email,
                subject: 'Account Activation Link',
                html : `<h2>Please click on given link to
                    activate you account</h2>
                    <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
                `
            };
            mg.messages().send(data, function (error, _body) {
                if(error){
                    return res.json({
                        error: 'err.message'
                    })
                }
                return res.json({message: 'Email has been sent, kindly activate your account'})
            });
        });
    }catch(error){
        next(error)
    }
}

//update the user email
exports.updateUser = async (req, res, next) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { $set: {isActivate: true} },
        { new: true }
      );
      return res.status(200).json(updatedUser);
    } catch (err) {
      next(err);
    }
};

//get User
exports.getUser = async(req,res,next) => {
    try{
        const user = await User.findById(req.params.id);
        return res.status(200).json(user);
    }catch(err){
        next(err)
    }
}

//delete the user
exports.deleteUser = async(req,res,next)=> {
    try{
        const {email} = req.body
        if(!email){
        return res.status(400).json({
            success: false,
            message: "name is not exist"
        })
        }
        await User.findOneAndUpdate({email}, {$set:{isDeleted:true}});
        return res.status(200).json({
        success: true,
        message: "User has been deleted!."
        });
    } catch(err){
        next(err)
    }
}





