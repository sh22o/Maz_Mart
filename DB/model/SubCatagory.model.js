import { Schema, model ,Types} from "mongoose";




const subcatagorySchema = new Schema({

    name: {
        type: String,
        required: [true, 'catagoty  is required'],
        unique: [true, 'category name must be unique'],
        min: [2, 'minimum length 2 char'],
        max: [20, 'max length 20 char']

    }, 
    image:String , 
    imagePublicID:String, 
    createdBy: {
        type: Types.ObjectId,
        ref: "User",
        required: [true, 'Category owner is required']
    },
    updatedBy:{ 
        type: Types.ObjectId,
        ref: "User"
        
    },
    catagoryId:{
        type: Types.ObjectId,
        ref:"Catagory"
    }
  
}, {
    timestamps: true 
})


const subcatagoryModel = model('subCatagory', subcatagorySchema)
export default subcatagoryModel