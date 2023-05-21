import { Router } from "express";
import { auth } from "../../middleware/auth.js"; 
import endPoint from './brand.endPoint.js'
import * as brand from './controller/brand.js' 
import {fileValidation, myMulter} from '../../services/multer.js'
const router = Router({})




router.post('/',auth(endPoint.add),myMulter(fileValidation.image).single('image'),brand.CreatBrand)
router.get('/',brand.Brands )
router.put('/:id',auth(endPoint.update),myMulter(fileValidation.image).single('image'),brand.updateBrand) 




export default router