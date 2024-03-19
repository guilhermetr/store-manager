export interface Order {
    id?: number;
    providerId?: number;
    orderItems: OrderItem[];
    comments: string;
    status: OrderStatus;
    createdBy: string;
}

export interface OrderItem {
    id?: number;
    orderId?: number;
    productId?: number;
    quantity?: number;        
}

export enum OrderStatus {
    Active = 0,
    Finished = 1,
}
