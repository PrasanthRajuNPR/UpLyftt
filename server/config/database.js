const mongoose = require("mongoose");
require("dotenv").config();
const dbConnect = () =>{
    mongoose.connect(process.env.DB_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
    })
    .then(()=>{console.log("Connection established with DB successfully")})
    .catch((err)=>{console.log("Error in connecting with db")})
}

module.exports = dbConnect;