const mongoose = require("mongoose");
require('dotenv').config();
mongoose.connect(process.env.DB);

const userSchema=new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minlength:6,
    },
    password:{
        type: String,
        required: true,
    },
    firstName:{
        type: String,
        required: true,
        trim: true,
        max:40,
    },
    lastName:{
        type: String,
        required: true,
        trim: true,
        maxlength:40
    },
    salt:{
        type: String,
        required:true,
    }
});

const accountSchema=new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    balance:{
        type:Number,
        required: true,
    }
    
})
const User=mongoose.model('User',userSchema);
const Account=mongoose.model('Account',accountSchema);

module.exports={
    User,
    Account
}



