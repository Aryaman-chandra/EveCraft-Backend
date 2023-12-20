const express = require('express')

const {connectToDb } = require('./db')

const User = require('./models/Users')

const {mongoose} = require('mongoose')

const userRoutes = require('./routes/userRoutes')

const eventRoutes = require('./routes/eventRoutes')

const bcrypt = require('bcrypt')

// init app & middleware

const app = express();

app.use(express.json())

    connectToDb()

    mongoose.connection.once('open',()=>{
    app.listen(3000,()=>{
        console.log('app listening on port 3000')
    })
})

// routes 
app.use('/users',userRoutes)
app.use('/events',eventRoutes)
