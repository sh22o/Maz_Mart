


import { Schema, model, Types } from "mongoose";

const AucationSchema = new Schema({
    name: {
        type: String,
        required: [true, 'name of Auction  is required'],
        unique: [true, 'Aucation name must be unique'],
        min: [2, 'minimum length 2 char'],
        max: [20, 'max length 2 char'],
        trim: true

    },
    Catagory:{
        type:String , 
        required: [true, 'name of Catagory   is required'],
        min: [2, 'minimum length 2 char'],
        max: [20, 'max length 2 char'],
        trim: true
    }, 
    
    type:{
        type: [String],
        enum: ['new', 'used', 'outlet']
    },
    createdBy: {
        type: Types.ObjectId,
        ref: "User",
        required: [true, 'Aucation  owner is required']
    },
    updatedBy: {
        type: Types.ObjectId,
        ref: "User"
    },
    amount: {
        type: Number,
        default: 0
    },
    slug: String,
    description: String,
    images: [String],
    imagePublicIds: [String],
    StartAT:String, 
    endAt:String 
   
}, {

    timestamps: true
})


const AucationModel = model('Aucation', AucationSchema)
export default AucationModel