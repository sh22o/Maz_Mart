
import { Schema, model ,Types} from "mongoose";




const BrandScema = new Schema({

    name: {
        type: String,
        required: [true, 'brand is required'],
        unique: [true, 'brand  name must be unique'],
        min: [2, 'minimum length 2 char'],
        max: [20, 'max length 20 char']

    }, 
    image:String , 
    imagePublicID:String, 
    createdBy: {
        type: Types.ObjectId,
        ref: "User",
        required: [true, 'brand  owner is required']
    },
    updatedBy:{ 
        type: Types.ObjectId,
        ref: "User"
        
    }

  
}, {
    timestamps: true ,
 
}) 



const BrandModel = model('Brand', BrandScema)
export default BrandModel