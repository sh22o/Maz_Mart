import cartModel from '../../../../DB/model/Cart.model.js' 
import { asyncHandndler } from "../../../services/ErrorHandling.js"; 
import { create, findOne, findOneAndUpdate ,find} from "../../../../DB/DBMethods.js";



export const addToCart = asyncHandndler(async (req, res, next) => {

    const { products } = req.body
    const { _id } = req.user
    const findCart = await findOne({
        model: cartModel,
        filter: { userId: _id }
    })
    // if user enter product to cart first time we create cart for him and add his products list
    if (!findCart) {
        const cart = await create({
            model: cartModel,
            data: {
                userId: _id,
                products
            }
        })
        return res.status(201).json({ message: "Done", cart })
    }

    // update exist cart

    for (const product of products) {
        let match = false;
        for (let i = 0; i < findCart.products.length; i++) {
            if (product.productId == findCart.products[i].productId.toString()) {
                findCart.products[i] = product
                match = true;
                break;
            }
        }
        if (!match) {
            findCart.products.push(product)
        }
    }

    await findOneAndUpdate({
        model: cartModel,
        filter: { userId: _id },
        data: { products: findCart.products },
        options: { new: true }
    })
    return res.status(200).json({ message: "Done", findCart })
})