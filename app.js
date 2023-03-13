const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const app = express();
const router = require('./routes/route');

const port = process.env.PORT || 8000;

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/api", router);

//mongodb connection
const connect = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to mongoDB");
    } catch(error){
        throw error;
    }
}

// listening on port 8800
app.listen(8000, () => {
    connect()
    console.log(`Listening on port ${port}`);
})