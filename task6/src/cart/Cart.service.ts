import {getCart, createCart, updateCart, deleteCart} from "./Cart.repository";
import {ICart} from "./Cart.model";
export const getProfileCart = async (): Promise<ICart> => {
    const cart = await getCart();

    return cart || await createCart();
}
const unifyCartResponse = (cart: ICart): {cart: ICart, total: number} => {
    const total = cart.items.reduce((totalPrice, {product, count}) => (
        totalPrice + (product.price * count)
    ) , 0);
    return {total, cart}
}
export const handleGetCartInfo = async ():Promise< {cart: ICart, total: number}>  =>  {
    const cart = await getProfileCart();
    return unifyCartResponse(cart)
}

export const updateProfileCart = async (data: ICart):Promise<{cart: ICart, total: number} | null>  => {
   const cartData = await updateCart(data);

   return cartData ? unifyCartResponse(cartData) : null;
}

export const deleteProfileCart = async () => {
    return await deleteCart();
}
