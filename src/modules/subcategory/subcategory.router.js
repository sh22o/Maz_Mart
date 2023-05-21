import { Router } from "express";
import { auth } from "../../middleware/auth.js"; 
import endPoint from './subcategory.endPoint.js'
import * as subcatagory from './controller/subCategory.js' 
import {fileValidation, myMulter} from '../../services/multer.js'
const router = Router({ mergeParams: true })




router.post('/',auth(endPoint.add),myMulter(fileValidation.image).single('image'),subcatagory.CreatSubCatagory)

router.put('/:id',auth(endPoint.update),myMulter(fileValidation.image).single('image'),subcatagory.updateSubcategory) 
router.get('/',subcatagory.getAllsubCategories)
router.get('/:id',subcatagory.getSubCategoriesById)



export default router