const express = require('express')
const router =  express.Router() 

const userController = require('../controllers/userController')
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
    router.post('/signup',userController.handleSignUp)
    //for user login 
    router.post('/login',userController.handleLogin)
    //for logging a user out 
    router.get('/logout',userController.handleLogout)
    router.post('/forgotPassword',userController.forgotPassword)
    router.get('/resetPassword/:token',userController.renderResetPassword)
    router.patch('/resetPassword/:token',userController.resetPassword)
 module.exports = router