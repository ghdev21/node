import {model, Schema, Document} from "mongoose";
import {cartSchema, ICart} from "../cart/Cart.model";
import {ICheckout} from "./types";
import {cartItemSchema, ICartItem} from "../cart/cart-item/CartItem.model";


export interface IOrder extends ICheckout {
    userId: string;
    items: ICartItem[]
    cartId?: string
    total: number
}

export type IOrderSchema = IOrder & Document;

export const orderSchema = new Schema<IOrderSchema>({
    userId: {type: String, required: true},
    items: {
        type: [cartItemSchema],
        validate: {
            validator:  (items: ICartItem[]) => items.length > 0,
            message: 'Order must have at least one item',
        },
    },
    total: {type: Number, required: true},
    cartId: {type: String, ref: 'Cart', required: true, unique: true},
    comments: {type: String, required: true},
    delivery: {type: Object, required: true},
    payment: {type: Object, required: true},
});

export const OrderModel = model<IOrderSchema>('Order', orderSchema);
