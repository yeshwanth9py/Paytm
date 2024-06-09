const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 20
    },
    firstName: {
        type: String,
        required: true,
        unique: true,
        maxLength: 20
    },
    lastName: {
        type: String,
        required: true,
        unique: true,
        maxLength: 20
    },
    password:{
        type: String,
        minLength: 6,
        maxLength: 20
    }
})


// usersSchema.pre("save", (req, res, next)=>{

// })

const User = mongoose.model("User", usersSchema);


module.exports = {
    User
};