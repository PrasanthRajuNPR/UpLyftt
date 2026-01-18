const mongoose = require("mongoose");

const dummySchema = new mongoose.Schema({
    name:{
        type:String,
    }
})

module.exports = mongoose.model("Dummy",dummySchema);