


import { asyncHandndler } from "../../../services/ErrorHandling.js"; 
import  userModel   from '../../../../DB/model/User.model.js'
import {findByIdAndUpdate} from '../../../../DB/DBMethods.js'





export const add = asyncHandndler(async (req, res, next) => {
    const { productId } = req.params
    await findByIdAndUpdate({
        model: userModel,
        filter:req.user._id,
        //use addtoset >> to not dublicate product in my wishlist 
        data: { $addToSet: { wishlist: productId } }
    })
    return res.status(200).json({ message: "Done" })
})


export const remove = asyncHandndler(async (req, res, next) => {
    const { productId } = req.params
    await findByIdAndUpdate({
        model: userModel,
        filter:req.user._id, 
        // to delete item from wishlist by value product 
        data: { $pull: { wishlist: productId } }
    })
    return res.status(200).json({ message: "Done" })
})