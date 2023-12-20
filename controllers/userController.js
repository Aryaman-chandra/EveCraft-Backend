const bcrypt = require('bcrypt')
const User = require('../models/Users')

async function handleSignUp(req,res){
    try{
        let Hashpass = await bcrypt.hash(req.body.password, 8, null)
        await User.create(
            {"username":req.body.username,"email" : req.body.email, "hashedPassword" : Hashpass,"Events":req.body.Events})
            .then((user)=>{
            console.log('User genrated with credentials')
            var createdUser = {
                "username" : user.username ,
                "email" :  user.email , 
                "Events" : user.Events , 
            } 
           return  res.status(200).json(createdUser)
            })
        }catch(e)
        {
            var error = {'message' : e}
            console.log(error.message)
            return res.status(401).json('User with those details already exists')
        }
}
async function handleLogin (req,res){
    var email = req.body.email
    var Password = req.body.password
        var user = await User.findOne({email:email})

        if(!user)
        {
            return res.json('Invalid Username or Password')
        }

        var result = await bcrypt.compare(Password,user.hashedPassword)
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
        res.json('Invalid Username or Password')

}
    module.exports = {
        handleSignUp,
        handleLogin
    }