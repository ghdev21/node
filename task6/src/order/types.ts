
export interface IPayment {
    type: string,
    address: string,
    creditCard: string,
}

export interface IDelivery {
    type: string,
    address: string,
}

export interface ICheckout {
    userId: string,
    payment: IPayment,
    delivery: IDelivery,
    comments: string
}
