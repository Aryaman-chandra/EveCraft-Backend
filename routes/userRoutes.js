const express = require('express')
const router =  express.Router() 

const {handleSignUp, handleLogin , handleLogout} = require('../controllers/userController')
    //Midway of developing i realized our api must not return a list of our user 
    // router.get('/',async (req,res)=>{

    //     try
    //     {
    //     let users = await User.find({});
    //     res.status(200).json(users)
    //     }
    //     catch(e){
            
    //         console.log('cannot give users')
    //         return res.status(404).send('Cannot find User')
    //     }
    // })

    //for user sign-up
    router.post('/signup',handleSignUp)
    //for user login 
    router.post('/login',handleLogin)
    //for logging a user out 
    router.get('/logout',handleLogout)
 module.exports = router