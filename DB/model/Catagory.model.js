
import { Schema, model ,Types} from "mongoose";




const catagorySchema = new Schema({

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
        
    }

  
}, {
    timestamps: true ,
    toJSON: { virtuals: true },
    toObject: { virtual: true }
}) 
/* virutall its option in mongoo db to make link between two collection and use forgin key 
     to make data transport easly  without store in schema data */  
catagorySchema.virtual('subCatagory', {
    ref: "subCatagory",
    // local field for module (in current folder ) _id 
    localField: "_id",
    foreignField: "catagoryId"
})


const catagoryModel = model('Catagory', catagorySchema)
export default catagoryModel