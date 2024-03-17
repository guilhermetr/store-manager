import { Injectable } from '@angular/core';
import { Order, OrderStatus } from '../models/order.model';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:7297/orders';

  private orders: Order[] = [
    {
      id: 1,
      providerId: 1,
      orderItems: [
        { id: 1, productId: 1, quantity: 1 },
        { id: 2, productId: 2, quantity: 2 },
      ],
      comments: '', 
      status: OrderStatus.Active
    },
    {
      id: 2,
      providerId: 2,
      orderItems: [
        { id: 3, productId: 3, quantity: 3 },        
      ],
      comments: 'This is an order that has comments.', 
      status: OrderStatus.Active
    },
    {
      id: 3,
      providerId: 1,
      orderItems: [
        { id: 1, productId: 1, quantity: 1 },
        { id: 2, productId: 2, quantity: 2 },
        { id: 3, productId: 3, quantity: 3 },
      ],
      comments: 'This is an order that has more comments. This is an order that has more comments. This is an order that has more comments.', 
      status: OrderStatus.Finished
    },
  ];
  private ordersSubject: BehaviorSubject<Order[]> = new BehaviorSubject<Order[]>(this.orders);
  public orders$: Observable<Order[]> = this.ordersSubject.asObservable();

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
      // this.loadOrders();
  }

  private loadOrders(): void {
    this.http.get<Order[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error fetching orders:', error);
        return throwError(() => new Error('Could not load orders. Please try again later.'));
      })
    ).subscribe(orders => {      
      this.orders = orders;
      this.ordersSubject.next(orders);
    });
  }

  getOrders(): Order[] {
    return this.orders;
  }

  getOrder(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  addOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, order);
  }

  updateOrder(order: Order): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${order.id}`, order);
  }

  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
