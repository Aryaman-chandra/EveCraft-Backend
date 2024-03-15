const bcrypt = require('bcrypt')
const User = require('../models/Users')
const jwt = require('jsonwebtoken')
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
    module.exports = {
        handleSignUp,
        handleLogin ,
        handleLogout
    }
