import jwt from 'jsonwebtoken'
import {asyncHandndler} from '../services/ErrorHandling.js' 
import  userModel  from '../../DB/model/User.model.js' 
 export  const roles ={ 
    Admin:"Admin",
    User:"User",
    hr:'hr',
    seller:'seller' 

 }
    

export const auth = (accessRoles=[]) => {
    return asyncHandndler(
        async (req, res, next) => {
       
            console.log({ bb: req.body });
            const { authorization } = req.headers
            console.log({ authorization });
            if (!authorization?.startsWith(process.env.BearerKey)) {
               return next( Error ("In-valid Bearer key" , {cause:400}))
            } else {
                const token = authorization.split(process.env.BearerKey)[1]
                const decoded = jwt.verify(token, process.env.tokenSignature)
                if (!decoded?.id || !decoded?.isLoggedIn) {
                    return next( Error ("In-valid token payload " , {cause:400}))

                } else {
                    const user = await userModel.findById(decoded.id).select('email userName role')
                    if (!user) { 
                        return next( Error ("Not register user" , {cause:401}))

                    } else { 
                        if(!accessRoles.includes(user.role)){
                            return    next( Error ("Not Auth user" , {cause:403}))  

                        }else{ 
                            req.user = user
                            return  next()

                        }

                       

                    }
                }
            }
         


    }
    ) 
}