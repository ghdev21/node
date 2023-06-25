export interface IProduct {
    title: string,
    description: string,
    price: number,
    code?: string
}

export interface IExtendedProduct extends IProduct{
    id?: string
    _id?: string
}
