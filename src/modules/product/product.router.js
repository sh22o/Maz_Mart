import { Router } from "express";
import { auth } from "../../middleware/auth.js"; 
import endPoint from './product.endPoint.js'
import * as product from './controller/product.js' 
import {fileValidation, myMulter} from '../../services/multer.js' 
import wishlistRouter from '../wishlist/wishlist.router.js'
const router = Router({})
router.use('/:productId/wishList' , wishlistRouter)



router.post('/',auth(endPoint.add),myMulter(fileValidation.image).array('images' , 5),product.AddProducts)
//router.get('/',brand.Brands )
router.put('/:id',auth(endPoint.update),myMulter(fileValidation.image).array('images' , 5),product.UpdateProduct) 




export default router