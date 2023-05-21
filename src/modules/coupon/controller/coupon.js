import { create, findByIdAndDelete, findOne, findOneAndUpdate ,find} from "../../../../DB/DBMethods.js";
import couponModel from "../../../../DB/model/Copon.model.js";
import { asyncHandndler } from "../../../services/ErrorHandling.js"; 



export const createCoupon = asyncHandndler(
    async (req, res, next) => {

        const findCoupon = await findOne({
            model: couponModel,
            filter: { name: req.body.name }
        })

        if (findCoupon) {
            return next(new Error("Coupon name already exist", { cause: 409 }))
        }

        req.body.createdBy = req.user._id
        const coupon = await create({
            model: couponModel,
            data: req.body
        })
        return res.status(201).json({ message: "Done", coupon })
    }
)


export const updateCoupon = asyncHandndler(
    async (req, res, next) => {
        const { id } = req.params
        req.body.updatedBy = req.user._id
        const coupon = await findOneAndUpdate({
            model: couponModel,
            filter: { _id: id },
            data: req.body
        })
        return coupon ? res.status(200).json({ message: "Done", coupon }) : next(new Error('In-valid coupon Id', { cause: 404 }))
    }
)


export const deleteCoupon = asyncHandndler(
    async (req, res, next) => {
        const { id } = req.params
        const coupon = await findByIdAndDelete({
            model: couponModel,
            filter: id,
        })
        return coupon ? res.status(200).json({ message: "Done", coupon }) : next(new Error('In-valid coupon Id', { cause: 404 }))
    }
)