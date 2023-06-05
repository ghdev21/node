import {model, Schema, Document} from "mongoose";
import {cartItemSchema, ICartItem} from "./cart-item/CartItem.model";

export interface ICart {
    id: string;
    userId?: string
    items: ICartItem[],
    deleted?: boolean
}

export type ICartSchema = ICart & Document;

export const cartSchema = new Schema<ICartSchema>({
    items: [cartItemSchema],
    userId: String,
    deleted: {
        type: Boolean,
        default: false,
    }
});

export const CartModel = model<ICart>('Cart', cartSchema);
