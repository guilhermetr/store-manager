// product.service.ts
import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { Product } from '../models/product.model';
import { MessageDisplayService } from './message-display.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'https://localhost:7046/products';

  private products: Product[] = [];
  private productsSubject: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>(this.products);
  public products$: Observable<Product[]> = this.productsSubject.asObservable();

  constructor(private http: HttpClient, private messageDisplayService: MessageDisplayService) {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.http.get<Product[]>(this.apiUrl).pipe(
      catchError(error => {
        this.messageDisplayService.displayMessage('Erro carregando produtos');
        return throwError(() => new Error(error));
      })
    ).subscribe(products => {      
      this.products = products;
      this.productsSubject.next(products);
    });
  }

  getProducts(): Product[] {
    return this.products;
  }

  getProduct(id: number): Product | undefined {
    return this.products.find(product => product.id == id);
  }

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product).pipe(
      tap((addedProduct) => {        
        this.products.push(addedProduct);
        this.productsSubject.next(this.products);        
      }),
      catchError(error => {
        this.messageDisplayService.displayMessage('Erro criando produto');
        return throwError(() => new Error(error));
      })
    );
  }

  updateProduct(product: Product): Observable<Product> {
    const updatedProduct: Product = { ...product };

    const url = `${this.apiUrl}/${product.id}`;
    return this.http.put<Product>(url, updatedProduct).pipe(
      tap((updatedProduct) => {
        const index = this.products.findIndex(product => product.id === updatedProduct.id);
        if (index !== -1) {
          this.products[index] = updatedProduct;
          this.productsSubject.next(this.products);
        }
      }),
      catchError(error => {
        this.messageDisplayService.displayMessage('Erro atualizando produto');
        return throwError(() => new Error(error));
      })
    );
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const product = this.products.find(product => product.id === id);
        if (product) {
          product.isActive = false;
          this.productsSubject.next(this.products);
        }
      }),
      catchError(error => {
        this.messageDisplayService.displayMessage('Erro eliminando produto');
        return throwError(() => new Error(error));
      })
    );
  }

}
