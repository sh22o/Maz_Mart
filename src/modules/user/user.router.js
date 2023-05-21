
//have error on auth file with my update pass 
import { auth } from '../../../src/middleware/auth.js'
import * as userController from './controller/user.js'
import { Router } from "express"; 
import {endPoint} from './user.endPoint.js'
import userModel from '../../../DB/model/User.model.js';
const router = Router()




router.get('/', auth(endPoint.profile) , async (req ,res)=>{
    const user = await userModel.findById(req.user._id).populate("wishlist")
    res.status(200).json({message:"Done ", user })
})
router.patch('/updatedPassword', auth(endPoint.profile) ,userController.updatePassword)



export default router