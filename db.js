const {  mongoose } = require('mongoose')


module.exports = {
    connectToDb: async ()=>{
        try
        {
          await  mongoose.connect('mongodb://127.0.0.1:27017/EveCraft')
        }
        catch (err){
            console.log(err)
        }
        
    },
}