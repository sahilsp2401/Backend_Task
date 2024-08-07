const mongoose = require('mongoose');
const {Schema} = mongoose

const UserSchema = new Schema({
    fullname:{
        type: String,
        required : true
    },
    username:{
        type: String,
        required : true,
        unique: true
    },
    email : {
        type: String,
        required : true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique:true
    },
    address: {
        type: String,
        required: false,
        default: ''
    },
    password:{
        type: String,
        required : true
    },
    friends: [
        { 
            type: mongoose.Schema.Types.ObjectId, ref: 'User' 
        }
    ],
    date:{
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User',UserSchema)
module.exports = User;
  