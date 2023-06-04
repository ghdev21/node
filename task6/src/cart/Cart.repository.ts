import {CartModel, ICart} from "./Cart.model";
import {makeProductDTO} from "../product/Product.repository";
import {IProductSchema} from "../product/Product.model";
import {CartItemModel} from "./cart-item/CartItem.model";
import {Document} from "mongoose";
import {generateId} from "../utils";

export const createCart = async (): Promise<ICart> => {
    try {
        const cart = new CartModel({items: [], userId: generateId(8)});
        const {items, _id} = await cart.save();

        return {items, id: _id.toString()};
    } catch (err) {
        console.log(err);
        throw new Error('Unable initialise cart')
    }
}

export const getCart = async (): Promise<ICart | null> => {
    try {
        const cart = await CartModel.findOne();
        if (cart) {
            const itemsDTO = cart.items.map(({product, count}) => ({
                product: makeProductDTO(product as IProductSchema),
                count
            }));
            return {items: itemsDTO, id: cart._id.toString(), userId: cart.userId};
        }
        return null;
    } catch (err) {
        console.log(err);
        throw new Error('Unable find cart')
    }
}

export const updateCart = async ({items, id}: ICart): Promise<ICart | null> => {
    try {
        const cartItems = items.map(({product, count}) => {
            const {id, ...rest} = product;
            return new CartItemModel({product: {...rest, _id: id}, count})
        });
        const updatedCart = await CartModel.findByIdAndUpdate(id, {items: cartItems}, {new: true});
        if (updatedCart) {
            const res = updatedCart?.items.map(({product, count}) => {
                const productDTO = makeProductDTO(product as IProductSchema);
                return {product: productDTO, count}
            }) // omit _id
            return {items: res, id: updatedCart._id.toString(), userId: updatedCart.userId}
        }
        return null;
    } catch (err) {
        console.log(err);
        throw new Error('Invalid id format')
    }
}

export const deleteCart = (): Promise<Document | null> => {
    try {
        return CartModel.findOneAndUpdate(
            {},
            {
                deleted: true,
                deletedAt: new Date(),
            },
            { new: true }
        ).exec();
    } catch (error) {
        throw new Error('Failed to delete cart');
    }
};
