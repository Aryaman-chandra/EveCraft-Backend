const nodemailer = require('nodemailer')
require('dotenv').config()
const sendEmail = (option,req,res) =>{
    //create a transporter
    const transporter = nodemailer.createTransport({
        service : 'gmail',
        auth : {
            user : process.env.EMAIL,
            pass : process.env.EMAIL_PASSWORD
        }
    })
    transporter.sendMail(option.body,(err)=>{
        if(err){
            console.log('error sending email');
            option.onFailure(err)
        }
        else{
            option.onSuccess(req,res)
            console.log(`${option.type} sent`)
        }
    })
}
module.exports = sendEmail
