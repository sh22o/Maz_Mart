import { Router } from "express";
import { auth } from "../../middleware/auth.js"; 
import endPoint from './category.endPoint.js'
import * as catagory from './controller/category.js' 
import {fileValidation, myMulter} from '../../services/multer.js'
import subCategory from '../subcategory/subcategory.router.js'
// use merge params to conected with catagory module and take id for catagory >> option nodejs
const router = Router({mergeParams:true})

router.use('/:catagoryId/subCategory',subCategory)


router.post('/',auth(endPoint.add),myMulter(fileValidation.image).single('image'),catagory.CreatCatagory)

router.put('/:id',auth(endPoint.update),myMulter(fileValidation.image).single('image'),catagory.UpdateCatagory) 
router.get('/',catagory.getAllCategories)
router.get('/:id',catagory.getCategoriesById)



export default router