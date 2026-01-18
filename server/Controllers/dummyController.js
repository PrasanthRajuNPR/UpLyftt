const Dummy = require("../models/dummy");

exports.dummy = async (req,res)=>{
    try{
        const insertData = await Dummy.create({name:"Hello Prasanth Raju"});

        const Data = await Dummy.findOne({name:"Hello Prasanth Raju"});

        res.status(200).json({
            success:true,
            data:Data
        })
    }catch(err){
        res.status(400).json({
            success:false,
            error:err.message
        })
    }
}