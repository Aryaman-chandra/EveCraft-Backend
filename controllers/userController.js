const bcrypt = require('bcrypt')
const User = require('../models/Users')
const jwt = require('jsonwebtoken')

const maxAge = 3*24*60*60

const createToken = (id)=>{
        return jwt.sign({ id } , 'Our Secret for now' ,{
            expiresIn : maxAge
        })
}

const handleErrors = (err) =>{
		  console.log(err.message);
		  let errors = { email : '' , password : ''}

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
            console.log('User genrated with credentials')
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
        var user = await User.findOne({email:email})

        if(!user)
        {
            return res.status(404).json({email : 'email not found'})
        }

        var result = await bcrypt.compare(Password,user.password)
        if(result)
        {

            var user_details = {
                id : user._id,
                email: user.email,
                events : user.Events 
            } 
            
            res.status(200).json(user_details)
        }
        else
        res.status(404).json('Invalid Username or Password')

}
    module.exports = {
        handleSignUp,
        handleLogin
    }
