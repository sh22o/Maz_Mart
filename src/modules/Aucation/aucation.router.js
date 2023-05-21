import { Router } from "express";
import { auth } from "../../middleware/auth.js"; 
import endPoint from './aucation.endpoint.js'
import * as Aucation  from './controler/Aucation.js' 
import {fileValidation, myMulter} from '../../services/multer.js'  

const router = Router()


router.post('/',auth(endPoint.add),myMulter(fileValidation.image).array('images' , 5),Aucation.AddAucation)


export default router 