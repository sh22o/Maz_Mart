import { asyncHandndler } from "../../../services/ErrorHandling.js"; 
import {create,find,findOneAndUpdate} from '../../../../DB/DBMethods.js' 
import catagoryModel from '../../../../DB/model/Catagory.model.js'
import subcatagoryModel from '../../../../DB/model/SubCatagory.model.js'
import cloudinary from '../../../services/cloudinary.js' 
import {paginate} from '../../../services/pagination.js'
import slugify from 'slugify'


  export const CreatSubCatagory = asyncHandndler(
    async (req, res, next) => {
        if (!req.file) {
            return next(new Error('Image is required', { cause: 400 }))
        } else {
            const {catagoryId}= req.params
            const catagory = await find({model :catagoryModel , filter:{catagoryId}})
            const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `EcommerceTest/catagories/${catagory._id}`})
             const {name} = req.body 
            if(!catagory){
                next(new Error(' invalid parent catagory id  ', { cause: 404}))
            }else{ 
                const Subcatagory = await create({
                    model:subcatagoryModel,
                     data: { 
                      image : secure_url,
                      name,
                      slug:slugify(name),
                      ImagePublicId: public_id,
                      createdBy:req.user._id,
                      catagoryId:catagory._id
                    } 
                   
                     
                     }) 
                    
                 
                  
                  console.log("Subcatagory",Subcatagory);
                  return Subcatagory ? res.status(201).json({ message: "Done",Subcatagory  }) :
                      next(new Error('Fail to add newSubCategory', { cause: 400 }))

            }



          
        }

    }
) 
// have a error in this function 
export const updateSubcategory = asyncHandndler(
    async (req, res, next) => {
       // check about catagory id then id for subccatagory 
        const { categoryId, id } = req.params
        if (req.file) {
            const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `EcommerceTest/catagories/${catagory.id}` })
            req.body.image = secure_url;
            req.body.imagePublicId = public_id;
        }
       // if have name for subcatagory 
        if (req.body.name) {
            req.body.slug = slugify(req.body.name)
        }

        req.body.updatedBy = req.user._id

        const catagory = await findOneAndUpdate({
            model: subcatagoryModel,
            filter: { _id: id, categoryId: categoryId },
            data: req.body,
            options: { new: false }
        })

        if (catagory) {
           /* if (req.file) {
                await cloudinary.uploader.destroy(catagory.imagePublicId)
            }*/ 
            return res.status(200).json({ message: "Done", catagory  })
        }
        else { 
            // to delete pic uploaded because dont have a catagory file with id 
            await cloudinary.uploader.destroy(req.body.imagePublicId)
            return next(new Error('Fail to update this subCategory', { cause: 400 }))
        }

    }
) 


// to get all subcata
export const getAllsubCategories = asyncHandndler (
    async (req, res, next) => {
        const { catagoryId } = req.params;
        const { skip, limit } = paginate({ page: req.query.page, size: req.query.size })
        const category = await find({
            model: subcatagoryModel,
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
                    path: "catagoryId",
                }
            ],
            skip,
            limit
        })
        return res.status(200).json({ message: "Done", category })

    }
)







 // get sub catagry by id 
 export const getSubCategoriesById = asyncHandndler(
     
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
            },
            {
                path: "catagoryId",
            }
        ] 
      }) 


      return res.status(200).json({ message: "Done", catagory })
    }



   )