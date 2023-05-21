import { Schema, Types, model } from "mongoose";
import {roles }from '../../src/middleware/auth.js'

const userSchema = new Schema({

    userName: {
        type: String,
        required: [true, 'userName is required'],
        min: [2, 'minimum length 2 char'],
        max: [20, 'max length 2 char']

    },
    email: {
        type: String,
        unique: [true, 'email must be unique value'],
        required: [true, 'userName is required'],
    },
    password: {
        type: String,
        required: [true, 'password is required'],
    }
    , NationalID:{
      type:String 
    }
    ,
    phone: {
        type: String,
    },
    role: {
        type: String,
        default: 'User',
        enum: [roles.Admin, roles.User ]
    },

    active: {
        type: Boolean,
        default: false,
    },
    confirmEmail: {
        type: Boolean,
        default: false,
    },
    blocked: {
        type: Boolean,
        default: false,
    },
    image: String,
    DOB: String,
    wishlist :[{
        type:Types.ObjectId,
        ref:"MazProduct"
    }] 
}, {
    timestamps: true
})


const userModel = model('User', userSchema)
export default userModel