import { Injectable } from '@angular/core';
import { Order, OrderStatus } from '../models/order.model';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MessageDisplayService } from './message-display.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'https://localhost:7144/orders';

  private orders: Order[] = [];
  private ordersSubject: BehaviorSubject<Order[]> = new BehaviorSubject<Order[]>(this.orders);
  public orders$: Observable<Order[]> = this.ordersSubject.asObservable();

  constructor(private http: HttpClient, private messageDisplayService: MessageDisplayService) { 
    this.loadOrders();
  }

  private loadOrders(): void {
    this.http.get<Order[]>(this.apiUrl).pipe(
      catchError(error => {
        this.messageDisplayService.displayMessage('Erro carregando pedidos');
        return throwError(() => new Error(error));
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
    return this.http.post<Order>(this.apiUrl, order).pipe(
      tap((addedOrder) => {        
        this.orders.push(addedOrder);
        this.ordersSubject.next(this.orders);
      }),
      catchError(error => {
        this.messageDisplayService.displayMessage('Erro criando pedido');
        return throwError(() => new Error(error));
      })
    );
  }

  updateOrder(order: Order): Observable<Order> {
    const updatedOrder: Order = { ...order };

    const url = `${this.apiUrl}/${order.id}`;
    return this.http.put<Order>(url, updatedOrder).pipe(
      tap((updatedOrder) => {
        const index = this.orders.findIndex(order => order.id === updatedOrder.id);
        if (index !== -1) {
          this.orders[index] = updatedOrder;
          this.ordersSubject.next(this.orders);
        }
      }),
      catchError(error => {
        this.messageDisplayService.displayMessage('Erro atualizando pedido');
        return throwError(() => new Error(error));
      })
    );
  }

  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const index = this.orders.findIndex(order => order.id === id);
        if (index !== -1) {
          this.orders.splice(index, 1);
          this.ordersSubject.next(this.orders);
        }
      }),
      catchError(error => {
        this.messageDisplayService.displayMessage('Erro eliminando pedido');
        return throwError(() => new Error(error));
      })
    );
  }
}
