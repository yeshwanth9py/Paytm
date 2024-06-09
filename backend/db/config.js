const mongoose = require("mongoose");

const connectDb = async ()=>{
    try{
        await mongoose.connect("mongodb+srv://yeshwanth9:yeshwanth@cluster0.zazqvzt.mongodb.net/Paytm");
        console.log("successfully connected to db");
    } catch(err){
        console.log(err);
    }
}

module.exports = connectDb;