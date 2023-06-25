import {ICart} from "./Cart.model";
import {ICartItem} from "./cart-item/CartItem.model";
import {pool} from "../db/RDB-connections";
import {
    CREATE_CART_ITEMS_TABLE,
    CREATE_CART_TABLE, DELETE_CART_QUERY,
    INSERT_CART_QUERY,
    SELECT_CART_ITEMS_QUERY,
    SELECT_CART_QUERY, UPSERT_CART_ITEMS_QUERY
} from "../queries/cart";
import {replaceKeys} from "../order/order.repository";
const getCartItems = async (cartId: string): Promise<ICartItem[]> => {
    const cartItems = await pool.query(SELECT_CART_ITEMS_QUERY, [cartId]);

    return cartItems.rows.map(({count, ...product}) => ({product, count}))
}
export const getProfileCart = async (userIdentity: string, expectToExists: boolean = false, shouldRewriteId: boolean = true):Promise<ICart> => {
    try {
        await pool.query(CREATE_CART_TABLE);
        await pool.query(CREATE_CART_ITEMS_TABLE);
        const cart = await pool.query(SELECT_CART_QUERY, [userIdentity]);
        let cartData = cart.rows[0];
        if (!cart.rows.length && !expectToExists) {
            const {rows} = await pool.query(INSERT_CART_QUERY, [userIdentity]);
            cartData = {...rows[0]};
        }
        const result = shouldRewriteId ? replaceKeys(cartData, 'id', '_id'): cartData;

        return {...result, items: await getCartItems(cartData.id)};
    } catch (err) {
        console.error(err);
        throw new Error('Unable initialise cart')
    }
}
export const getExistingCart = async (userIdentity: string): Promise<ICart | null> => {
   try{
       const cart = await getProfileCart(userIdentity, true, false)

       if(!cart.items.length) {
           return null
       }

       return cart;
   }catch (err){
       console.error(err);
       throw new Error('Cart is empty or does not exist')
   }
}

export const updateCart = async ({items, id}: ICart, userId: string): Promise<ICart | null> => {
    try {
        const cart = await pool.query(SELECT_CART_QUERY, [userId]);
        if (!cart.rows) return null;

        const products: ICartItem[] = [];
        for (const {product, count} of items) {
            await pool.query(UPSERT_CART_ITEMS_QUERY, [id, product.id, count]);
            const cartItems = await getCartItems(id!);
            products.push(...cartItems)
        }
        return {items: products, id}

    } catch (err) {
        console.log(err);
        throw new Error('Invalid id format')
    }
}
export const deleteCart = async(userId: string): Promise<boolean> => {
    try {
        const res = await pool.query(DELETE_CART_QUERY, [userId]);

        return res?.rows[0]
    } catch (error) {
        throw new Error('Failed to delete cart');
    }
};
