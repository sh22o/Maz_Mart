 

 // this file asscess user by role 
 // aslo add seller bidder 
import {roles} from '../../middleware/auth.js'
export const  endPoint={ 
   profile:[roles.Admin, roles.User ]

}