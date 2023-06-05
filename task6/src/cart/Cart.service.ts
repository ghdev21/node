import {updateCart, deleteCart, getProfileCart} from "./Cart.repository";
import {ICart} from "./Cart.model";
import {makeProductDTO} from "../product/Product.repository";
import {IProductSchema} from "../product/Product.model";
export const getProfileCartHandler = async (userIdentity: string): Promise<ICart> => {
    const {items, _id, userId, deleted} = await getProfileCart(userIdentity);

    return {items, id: _id, userId, deleted};
}
const unifyCartResponse = (cart: ICart): {cart: ICart, total: number} => {
    const total = cart.items.reduce((totalPrice, {product, count}) => (
        totalPrice + (product.price * count)
    ) , 0);
    return {total, cart}
}

export const makeCartEntity = ({items, id}: ICart):{cart: ICart, total: number} => {
    const cartItemsDTO = items.map(({product, count}) => ({
        product: makeProductDTO(product as IProductSchema),
        count
    }));
    return unifyCartResponse({items: cartItemsDTO, id})
}
export const handleGetCartInfo = async (userIdentity: string):Promise< {cart: ICart, total: number}>  =>  {
    const {items, id} = await getProfileCartHandler(userIdentity);

    return makeCartEntity({items, id})
}

export const updateProfileCart = async (data: ICart, userIdentity: string):Promise<{cart: ICart, total: number} | null>  => {
   const cartData = await updateCart(data, userIdentity);

   return cartData ? unifyCartResponse(cartData) : null;
}

export const deleteProfileCart = async (userId: string) => {
    return await deleteCart(userId);
}
