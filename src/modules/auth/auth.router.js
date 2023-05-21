import * as rejesterController from './controller/registration.js' 
import * as validators from './auth.validation.js'
import { Router } from "express";  
import {validation} from '../../middleware/validation.js'
const router = Router() 
// signup & confirmEmail 
router.post('/signup',validation(validators.signup),rejesterController.signup)
router.get('/confirmEmail/:token',validation(validators.token),rejesterController.confirmEmail)
router.get('/requestEmailToken/:token',validation(validators.token),rejesterController.Reftoken)
router.patch("/sendCode" ,rejesterController.sendCode)
router.patch("/forgetPassword" , rejesterController.forgetPassword)  
// login
router.post('/login',validation(validators.login),rejesterController.login)




export default router