import { Product } from "./product.model";
import { Provider } from "./provider.model";

export interface Order {
    id?: number;
    providerId?: number;
    orderItems: OrderItem[];
    comments: string;
    status: OrderStatus;
}

export interface OrderItem {
    id?: number;
    productId?: number;
    quantity?: number;        
}

export enum OrderStatus {
    Active,
    Finished,
}
