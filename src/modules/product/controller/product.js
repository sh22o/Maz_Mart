import { asyncHandndler } from "../../../services/ErrorHandling.js"; 
import {create,find,findOneAndUpdate,findByIdAndUpdate,findOne} from '../../../../DB/DBMethods.js' 

//import productModel from "../../../../DB/model/product.model.js";
import subCatagoryModel from '../../../../DB/model/SubCatagory.model.js'
import CatagoryModel from '../../../../DB/model/Catagory.model.js'
import BrandModel from '../../../../DB/model/Brand.model.js'
import UserModel from '../../../../DB/model/User.model.js'
import MazProductModel from '../../../../DB/model/MazProduct.js'
import cloudinary from '../../../services/cloudinary.js' 
import {paginate} from '../../../services/pagination.js'
import slugify from 'slugify'


const populate = [
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
        populate: {
            path: "createdBy",
            select: "userName email image"
        }
    },
    {
        path: "subcategoryId",
        populate: {
            path: "createdBy",
            select: "userName email image"
        }
    },
    {
        path: "brandId",
        populate: {
            path: "createdBy",
            select: "userName email image"
        }
    }
   /* ,
    {
        path: "review"
    }*/ 
]  


// create product 
/* // have error in this function 
export const createProduct = asyncHandndler( 
    async (req, res, next) => {
        if (!req.files?.length) {
            return next(new Error('Images is required', { cause: 400 }))
        } else {
           // we can take values from params 
          // for filnal object need this from body 
            const { name, amount, discount, price, subcategoryId, categoryId, brandId } = req.body;
            if (name) {
                req.body.slug = slugify(name) 
                console.log('hhhhhhhhhh')
            }

            req.body.stock = amount
             // function to calculate offfers 
            req.body.finalPrice = price - (price * ((discount || 0) / 100))

            const category = await find({
                model: subCatagoryModel,
                filter: { _id: subcategoryId, categoryId }
            }) //{} , null >> catagory object { } or null value  
            console.log(category)
            if (!category) {
                return next(new Error('In-valid category or sub category ids', { cause: 404 }))
            }

            const brand = await find({
                model: BrandModel,
                filter: { _id: brandId }
            }) //{} , null >> catagory object { } or null value 
            console.log(brand)
            if (!brand) {
                return next(new Error('In-valid brand id', { cause: 404 }))
            }
              // make it with array product has many images 
              console.log(" befor function ")
            const images = []
            const imagePublicIds = []
            for(const file of req.files) { 
                // files take from body 
                console.log(req.files)
                const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `EcommerceTest/products/${name}` }) 
                console.log(secure_url ,public_id)
                images.push(secure_url)
               
                imagePublicIds.push(public_id) 
                console.log("  in function ")
            } 
            console.log(images) 
            console.log(imagePublicIds)

            req.body.images = images
            req.body.imagePublicIds = imagePublicIds
            req.body.createdBy = req.user._id 
            console.log('hhhh')
            console.log(images) 
            console.log(imagePublicIds) 
            console.log(req.user._id) 

                
            const product = await create({
                model: productModel,
                data: req.body
                
            }) 
            console.log(product)
            if(!product){
               res.json({})
            }
            return res.status(201).json({ message: "Done", product })
        }

    }
)*/ 

export const AddProducts = asyncHandndler(
    async (req, res, next) => {
        if (!req.files?.length) {
            return next(new Error('Images is required', { cause: 400 })) 
        } else {
            const { name, amount, discount, price }=req.body  
            if (name) {
                req.body.slug = slugify(name)
            } 
            req.body.stock = amount 
            req.body.finalPrice = price - (price * ((discount || 0) / 100)) 
            const images = []
            const imagePublicIds = []
            for (const file of req.files) {
                const { secure_url, public_id } = await cloudinary.uploader.upload(file.path,{ folder: `EcommerceTest/products/${name}` })
                images.push(secure_url)
                imagePublicIds.push(public_id)
            }

            req.body.images = images
            req.body.imagePublicIds = imagePublicIds
            req.body.createdBy = req.user._id 

            const product = await create({
                model:MazProductModel ,
                data: req.body
            })  
            console.log("product " ,product);
            return product ? res.status(201).json({ message: "Done", product }) :
                next(new Error('Fail to add newproduct', { cause: 400 }))

             
        } 
     
             
               
               }) 




  export const UpdateProduct = asyncHandndler(
    async (req, res, next) => {
        const { id } = req.params;

        const product = await find({
            model: MazProductModel ,
            filter: id
        }) 
        if (!product) {
            return next(new Error('In-valid product Id'))
        } 


        const { name, amount, price, discount, brandId } = req.body 

        if (name) {
            req.body.slug = slugify(name)
        } 

        if (amount) {
            const calStock = amount - product.soldItems
            calStock > 0 ? req.body.stock = calStock : req.body.stock = 0
        } 

        
        if (price & discount) {
            req.body.finalPrice = price - (price * (discount / 100))
        } else if (price) {
            req.body.finalPrice = price - (price * (product.discount / 100))
        } else if (discount) {
            req.body.finalPrice = product.price - (product.price * (discount / 100))
        } 

        if (brandId) {
            const brand = await find({
                model: BrandModel,
                filter: { _id: brandId }
            }) //{} , null
            if (!brand) {
                return next(new Error('In-valid brand id', { cause: 404 }))
            }
        }
        // to save who make update 
        req.body.updatedBy = req.user._id  

        if (req.files.length) {
            const images = []
            const imagePublicIds = []
            for (const file of req.files) {
                const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `EcommerceTest/products/${name}` })
                images.push(secure_url)
                imagePublicIds.push(public_id)
            }
            req.body.imagePublicIds = imagePublicIds
            req.body.images = images 

        } 
        const updateProduct = await findOneAndUpdate({
            model: MazProductModel,
            data: req.body,
            filter: { _id: product._id },
            options: { new: false }
        }) 
        if (updateProduct) {
            // if update with image id changes this function to delete from db and cloudinary 
            for (const imageID of product.imagePublicIds) {
                await cloudinary.uploader.destroy(imageID)
            }
            return res.status(200).json({ message: "Done", updateProduct })
        } else {
            return next(new Error(`fail to update  product with  ID : ${product._id}`, { cause: 400 }))
        }



    }




  )        
            
