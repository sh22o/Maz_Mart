import userModel from "../../../../DB/model/User.model.js" 
import {asyncHandndler} from '../../../services/ErrorHandling.js' 
import  bcrypt from'bcryptjs'


// update password 
 export const updatePassword= asyncHandndler (async (req,res,next)=>{ 
    const { oldPassword , newPassword}= req.body 
    const user = await userModel.findById(req.user._id)  
    const match = await bcrypt.compare(oldPassword,user.password) 
    if(!match){
       return  next( Error (" invalid password" , {cause:400}))
    }else{
        const hashpass= await bcrypt.hash(newPassword, parseInt(process.env.SALTROUND))
        await userModel.findOneAndUpdate({_id:user._id , password :hashpass}); 
        res.status(200).json({massage:"Done  password update succes" })

    }




 })