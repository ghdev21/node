import {CartModel, ICart, ICartSchema} from './Cart.model';
import {makeProductDTO} from '../product/Product.repository';
import {IProductSchema} from '../product/Product.model';
import {CartItemModel} from './cart-item/CartItem.model';
import {Document} from 'mongoose';

export const getProfileCart = async (userIdentity: string): Promise<ICartSchema> => {
	try {
		return await getExistingCart(userIdentity) || await createCart(userIdentity);
	} catch (err) {
		console.log(err);
		throw new Error('Unable initialise cart');
	}
};

export const getExistingCart = async(userIdentity: string): Promise<ICartSchema | null> => {
	return await CartModel.findOne({userId: userIdentity, deleted: false}).exec();
};

const createCart = async(userIdentity: string): Promise<ICartSchema> => {
	return await CartModel.create({items: [], userId: userIdentity, deleted: false});
};

export const updateCart = async ({items, id}: ICart, userId: string): Promise<ICart | null> => {
	try {
		const cartItems = items.map(({product, count}) => {
			const {id, ...rest} = product;
			return new CartItemModel({product: {...rest, _id: id}, count});
		});
		const filter = {userId, deleted: false, _id: id}; // to be confident the another user is able to update by id
		const updatedCart = await CartModel.findOneAndUpdate(filter, {items: cartItems}, {new: true});
		if (updatedCart) {
			const res = updatedCart?.items.map(({product, count}) => {
				const productDTO = makeProductDTO(product as IProductSchema);
				return {product: productDTO, count};
			}); // omit _id
			return {items: res, id: updatedCart._id.toString()};
		}
		return null;
	} catch (err) {
		console.log(err);
		throw new Error('Invalid id format');
	}
};

export const deleteCart = (userId: string): Promise<Document | null> => {
	try {
		return CartModel.findOneAndUpdate(
			{userId, deleted: false},
			{
				deleted: true,
			},
			{ new: true }
		).exec();
	} catch (error) {
		throw new Error('Failed to delete cart');
	}
};
