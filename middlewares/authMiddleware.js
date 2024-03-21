const jwt = require('jsonwebtoken')
require('dotenv').config()

const requireAuth = (req,res,next)=>{
    const token = req.body.token
    if(token){
        jwt.verify(token,process.env.SECRET_KEY,(err,decoded)=>{
            if(err)
            {
                console.log(err.message)
                var error = {
                    "code": err.code,
                    "message":err.message
                }
                res.status(400).json(error)
            }
            else{
                req.id = jwt.decode(token ,process.env.SECRET_KEY,(err, decoded)=>{
                    if(err)
                    {
                        //In case there is any error during decoding of the jwt
                        console.log(err.message)
                        var error = {
                            "message":err.message
                        }
                        res.status(401).json(error)
                    }
                    else
                    req.body.id = decoded._id
                })
                next()
            }
        })
    }
    else{
        res.status(400).json({"message":"No Token found"})
    }

}
module.exports = {
    requireAuth
}