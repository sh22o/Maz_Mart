import { asyncHandndler } from "../../../services/ErrorHandling.js"; 
import {create, findByIdAndUpdate,find,findbyId} from '../../../../DB/DBMethods.js' 
import catagoryModel from '../../../../DB/model/Catagory.model.js'
import cloudinary from '../../../services/cloudinary.js' 
import {paginate} from '../../../services/pagination.js'
import slugify from 'slugify'


  export const CreatCatagory = asyncHandndler(
    async (req, res, next) => {
        if (!req.file) {
            return next(new Error('Image is required', { cause: 400 }))
        } else {
            const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: "EcommerceTest/catagories" })
             const {name} = req.body 
           const catagory = await create({
              model:catagoryModel,
               data: { 
                image : secure_url,
                name,
                slug:slugify(name),
                ImagePublicId: public_id,
                createdBy:req.user._id
              } 
             
               
               }) 
              
           
            
            console.log("catagory " ,catagory);
            return catagory ? res.status(201).json({ message: "Done", catagory }) :
                next(new Error('Fail to add newCategory', { cause: 400 }))
        }

    }
) 

export const UpdateCatagory = asyncHandndler(
  async(req,res,next)=>{ 
    const {id}= req.params  
  
    if (req.file) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: "EcommerceTest/catagories" }) 
      req.body.image=secure_url; 
      req.body.ImagePublicId=public_id  
    

  }    
  if (req.body.name) {
    req.body.slug = slugify(req.body.name)
}
  
  req.body.updatedBy = req.user._id  
  const catagory = await findByIdAndUpdate({
    model:catagoryModel, 
    filter:{_id:id} ,
     data:req.body  ,
      options:{ new : false } 
    } 
     ) 
// if have image by this id >> delete this pic to add new save storage 
/*if (req.file) {
  await cloudinary.uploader.destroy(catagory.imagePublicId)
}*/ 
  return catagory ? res.status(200).json({ message: "Done update succes ", catagory }) :
      next(new Error('Fail to update  Category', { cause: 400 }))


  
  } )  

  export const getAllCategories =asyncHandndler (
    async (req, res, next) => {

        const { skip, limit } = paginate({ page: req.query.page, size: req.query.size })

        const catagory = await find({
            model: catagoryModel,
            populate: [
                {
                    path: "createdBy",
                    select: "userName email image"
                },
                {
                    path: "updatedBy",
                    select: "userName email image"
                }, 
                { 
                  path: "subCatagory" 
                }
               
               
            ],
            skip,
            limit
        })

        return res.status(200).json({ message: "Done", catagory})
          // not need in this function else handling >> get all product 
    }
)
 export const getCategoriesById = asyncHandndler(
     
    async (req , res, next ) =>{
      const catagory = await find({
        model:catagoryModel,
        filter:{_id:req.params.id},
        populate: [
            {
                path: "createdBy",
                select: "userName email image"
            },
            {
                path: "updatedBy",
                select: "userName email image"
            }
        ] 
      }) 


      return res.status(200).json({ message: "Done", catagory })
    }



   )

  