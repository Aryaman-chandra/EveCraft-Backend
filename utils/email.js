const nodemailer = require('nodemailer')
require('dotenv').config()
const sendEmail = (option) =>{
    //create a transporter
    const transporter = nodemailer.createTransport({
        service : 'gmail',
        auth : {
            user : process.env.EMAIL,
            pass : process.env.EMAIL_PASSWORD
        }
    })
    console.log(option.body)
    transporter.sendMail(option.body,(err)=>{
        if(err){
            console.log(err)
            console.log('error sending email');
        }
        else
        console.log(`${option.type} sent`)
    })
}
module.exports = sendEmail
