import { Schema, model, Types } from "mongoose";


const MazProductSchema = new Schema({

    name: {
        type: String,
        required: [true, 'name is required'],
        unique: [true, 'product name must be unique'],
        min: [2, 'minimum length 2 char'],
        max: [20, 'max length 2 char'],
        trim: true

    },
    type:{
        type: [String],
        enum: ['new', 'used', 'outlet']
    },
    slug: String,
    description: String,
    images: [String],
    imagePublicIds: [String],
    stock: {
        type: Number,
        default: 0
    },
    soldItems: {
        type: Number,
        default: 0
    },
    amount: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    finalPrice: {
        type: Number,
        default: 0
    },
    colors: {
        type: [String],
    },
    size: {
        type: [String],
        enum: ['s', 'm', 'l', 'xl']
    },
    createdBy: {
        type: Types.ObjectId,
        ref: "User",
        required: [true, 'product owner is required']
    },
    updatedBy: {
        type: Types.ObjectId,
        ref: "User"
    },
    brandId: {
        type: Types.ObjectId,
        ref: "Brand"
    }
  
},  {

    timestamps: true,
  
})




const MazProductModel = model('MazProduct', MazProductSchema)
export default MazProductModel