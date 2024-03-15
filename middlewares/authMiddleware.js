const jwt = require('jsonwebtoken')

const requireAuth = (req,res,next)=>{
    const token = req.body.token
    if(token){
        jwt.verify(token,'Our Secret for now',(err,decoded)=>{
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
                req.id = jwt.decode(token ,'Our secret for now',(err, decoded)=>{
                    if(err)
                    res.status(401)
                    else
                    req.body.id = decoded._id
                })
                next()
            }
        })
    }
    else{
        res.redirect('/')
    }

}
module.exports = {
    requireAuth
}