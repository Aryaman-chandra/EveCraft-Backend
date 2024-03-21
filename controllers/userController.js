const bcrypt = require('bcrypt')
const User = require('../models/Users')
const jwt = require('jsonwebtoken')
const crypto = require('node:crypto')
const sendEmail = require('../utils/email')
require('dotenv').config()
const maxAge = 3*24*60*60

const createToken = (id)=>{
        return jwt.sign({ id } , process.env.SECRET_KEY ,{
            expiresIn : maxAge
        })
}

const handleErrors = (err) =>{
		  console.log(err.message);
		  let errors = { email : '' , password : ''}

        //incorrect email 
        if(err.message === 'Email not found')
        {
            errors.email = 'Email not registred'
        }
        else if(err.message==='Wrong Password')
        {
            errors.password = 'Wrong Password'
        }
         //duplicate error code 
        if(err.code === 11000 )
        {
            errors.email = 'Email already Registred, try logging in instead'
            return errors
        }
		  //validation errors 
        if(err.message.includes('user validation failed'))
        {
            Object.values(err.errors).forEach( ({properties})=>{
                //console.log(properties)
                errors[properties.path] = properties.message
            })
        }
	      return errors
}

async function handleSignUp(req,res){
    try{
        //let Hashpass = await bcrypt.hash(req.body.password, 8, null)
        await User.create(
            {"username":req.body.username,"email" : req.body.email, "password" : req.body.password,"Events":req.body.Events})
            .then((user)=>{
            console.log('User generated with credentials')
            var createdUser = {
                "username" : user.username , 
                "email" :  user.email , 
                "events" : user.Events ,
                "_id" : user._id 
            }  
           const token = createToken(createdUser._id)
           res.cookie('jwt' , token , { httpOnly:true , maxAge : maxAge*1000})
           return  res.status(200).json(createdUser._id)
            })
        }catch(err)
        {
			const errors =handleErrors(err);
            return res.status(401).json(errors)
        }
}

async function handleLogin (req,res){
    var email = req.body.email
    var Password = req.body.password
       try {
        var user = await User.findOne({email:email})
        if(!user)
        {
            throw Error('Email not found')
        }

        var result = await bcrypt.compare(Password,user.password)
        if(result)
        {           
           const token = createToken(user._id)
            res.cookie('jwt' , token , { httpOnly:true , maxAge : maxAge*1000})
            res.status(200).json({ user: user._id , token : token })
        }
        else
            throw Error('Wrong Password')
       }
       catch(err){
            const errors = handleErrors(err)
            res.status(400).json({errors})
       }      
}

async function handleLogout(req,res){
    res.cookie('jwt','',{maxAge : 10})
    res.redirect('/')
}

async function forgotPassword(req,res) {
    const user = await User.findOne({email : req.body.email})
    if(!user){
       const error = new Error('We could not find any email',404)
       throw error;
    }
    const resetToken = user.createToken();
    await user.save();
    const resetUrl = `${req.protocol}://${req.get('host')}/users/resetPassword/${resetToken}`
    const message = `We have received a password reset request. Please use the below link to reset your password\n\n${resetUrl}`;
    const onSuccess = (req,res)=>{
            res.status(200).json({
            status : "Success!",
            message : "Password Reset link send to Email!"
    })
    }
    const onFailure = (err)=>{
        user.passwordResetToken = undefined
        user.passwordResetTokenExpires = undefined
        user.save()
        console.log(err.message)
        return res.status(400).json({
            status: 'error',
            message: 'Could not send email'
        })
    }
    let mail = {
        type : 'Password Reset Email',
        body :{
            from : 'aryamanc24@gmail.com',
            to : user.email,
            subject : 'Password Reset ',
            text : message
        },
        onSuccess : onSuccess,
        onFailure : onFailure
    }
     sendEmail(mail,req,res);
}
let resetPassword=async (req,res)=>{
    try{
    const token = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const user = await User.findOne({passwordResetToken:token, passwordResetTokenExpires:{$gt: Date.now()}})
    if(!user){
        return res.status(400).json({message:'Token is invalid or expired'})
    }
    user.password = req.body.password;
    user.passwordResetToken = undefined
    user.passwordResetTokenExpires = undefined
    await user.save()
    return res.status(200).json('password changed')
    }catch(err){
        const errors = handleErrors(err)
        console.log(err.message+"and stack is /n"+err.stack)
        return res.status(400).json(errors)
    }
}
let renderResetPassword = (req,res)=>{
    
    res.render('resetPassword',{
        token : req.params.token
    })
}
    module.exports = {
        handleSignUp,
        handleLogin ,
        handleLogout,
        forgotPassword,
        resetPassword,
        renderResetPassword
    }
