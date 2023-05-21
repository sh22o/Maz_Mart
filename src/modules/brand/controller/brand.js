import { asyncHandndler } from "../../../services/ErrorHandling.js"; 
import {create,find,findOneAndUpdate,findByIdAndUpdate} from '../../../../DB/DBMethods.js' 

import BrandModel from '../../../../DB/model/Brand.model.js'
import cloudinary from '../../../services/cloudinary.js' 
import {paginate} from '../../../services/pagination.js'
import slugify from 'slugify'


// to create new brand in collection 

  export const CreatBrand = asyncHandndler(
    async (req, res, next) => {
        if (!req.file) {
            return next(new Error('Image is required', { cause: 400 }))
        } else {

            const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `EcommerceTest/Brand` })
            const { name } = req.body
            const Brand = await create({
                model: BrandModel,
                data: {
                    name,
                    slug: slugify(name),
                    image: secure_url,
                    imagePublicId: public_id,
                    createdBy: req.user._id,
                }
            })
            return Brand ? res.status(201).json({ message: "Done", Brand }) :
                next(new Error('Fail to add new brand', { cause: 400 }))
        }

    }
) 


// for update brand data 

export const updateBrand = asyncHandndler( 
    async (req, res, next) => {

        const { id } = req.params
        if (req.file) {
            const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `EcommerceTest/Brand` })
            req.body.image = secure_url;
            req.body.imagePublicId = public_id;
        }

        if (req.body.name) {
            req.body.slug = slugify(req.body.name)
        }
       const  {name } = req.body 
        req.body.updatedBy = req.user._id

        const Brand = await findByIdAndUpdate({
            model: BrandModel,
            filter: { _id: id },
            data:req.body ,
            options: { new: false }
        }) 

   

        if (Brand) {
            /*if (req.file) {
                await cloudinary.uploader.destroy(Brand.imagePublicId)
            }*/ 
            return res.status(200).json({ message: "Done update sucess ", Brand })
        }
        else {
           // await cloudinary.uploader.destroy(req.body.imagePublicId)
            return next(new Error('Fail to update this Brand ', { cause: 400 }))
        }

    }
  
)  



// get all brands in my db 

export const Brands = asyncHandndler(
    async (req, res, next) => {

        const { limit, skip } = paginate({ page: req.query.page, size: req.query.size })
        const brandsList = await find({
            model: BrandModel,
            filter: {},
            populate: [
                {
                    path: "createdBy",
                    select: "userName email image"
                }
            ],
            skip,
            limit
        })

        return res.status(200).json({ message: "Done", brandsList })
    }
)











