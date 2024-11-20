const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { connect } = require('http2');
dotenv.config()




mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(()=>
    console.log("Connected to MongoDB")
)
.catch((err) => 
    console.error("Error connecting to MongoDB", err)
);