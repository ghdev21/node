import {ICheckout} from "./types";
import {createOrder, replaceKeys,} from "./order.repository";
import {handleGetCartInfo} from "../cart/Cart.service";
import {IOrder} from "./Order.model";

export const makeOrder = async (checkoutData: ICheckout) => {
    const {total, cart: {items, id: cartId}} = await handleGetCartInfo();
    const itemsWithNativeIDS = items.map(({product, count}) =>
        ({product: replaceKeys(product, 'id', '_id'), count}))

    const collectOrderData: IOrder = {
        items: itemsWithNativeIDS,
        cartId,
        total,
        ...checkoutData
    }
    const {id} = await createOrder(collectOrderData);
    const orderDTO = {
        ...collectOrderData,
        items,
        id
    }

    return orderDTO;
}
