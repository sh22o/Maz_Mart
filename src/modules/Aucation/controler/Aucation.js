import { asyncHandndler } from "../../../services/ErrorHandling.js";  
import cloudinary from '../../../services/cloudinary.js' 
import {paginate} from '../../../services/pagination.js'
import AucationModel from '../../../../DB/model/Aucation.model.js'
import slugify from 'slugify'
import {create} from '../../../../DB/DBMethods.js' 



export const AddAucation = asyncHandndler(
    async (req, res, next) => {
        if (!req.files?.length) {
            return next(new Error('Images is required', { cause: 400 })) 
        } else {
            const { name ,Catagory , amount ,StartAT , endAt }=req.body  
            if (name ||Catagory ) {
                req.body.slug = slugify(name) 
                req.body.slug = slugify(Catagory)
            } 
          
            const images = []
            const imagePublicIds = []
            for (const file of req.files) {
                const { secure_url, public_id } = await cloudinary.uploader.upload(file.path,{ folder: `EcommerceTest/Aucation/${name}` })
                images.push(secure_url)
                imagePublicIds.push(public_id)
            }

            req.body.images = images
            req.body.imagePublicIds = imagePublicIds
            req.body.createdBy = req.user._id 

            const Aucation = await create({
                model:AucationModel ,
                data: req.body
            })  
            console.log("Aucation  " ,Aucation);
            return Aucation ? res.status(201).json({ message: "Done ", Aucation }) :
                next(new Error('Fail to add  new Aucation ', { cause: 400 }))

             
        } 
     
             
               
               }) 

