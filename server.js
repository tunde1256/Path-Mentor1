const express = require('express');
const app = express();
require('dotenv').config()
const PORT = process.env.PORT || 3040
const morgan = require('morgan')
const teacherRoutes = require('./routes/teacherRoutes')
const studentRoutes = require('./routes/studentRoutes')


// Connect to MongoDB
require('./db/db')

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(morgan('combined'))
app.use((req, res, next) => {
    res.setTimeout(10 * 60 * 1000); // 10 minutes
    next();
  });
  
app.use("/api/students",studentRoutes)
app.use("/api/teachers",teacherRoutes)

app.listen(PORT,(req, res)=>{
 console.log(`listening on ${PORT}`)
})