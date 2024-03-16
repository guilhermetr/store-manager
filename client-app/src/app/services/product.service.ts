// product.service.ts
import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService implements OnInit {
  private apiUrl = 'http://localhost:7297/products';

  private products: Product[] = [
    {
      id: 1,
      name: "Produto 1",
      price: 99.99,
      active: true,
    },
    {
      id: 2,
      name: "Produto 2",
      price: 199.99,
      active: true,
    },
    {
      id: 3,
      name: "Produto 3",
      price: 299.99,
      active: true,
    },
    {
      id: 4,
      name: "Produto 4",
      price: 399.99,
      active: true,
    },
    {
      id: 5,
      name: "Produto 5",
      price: 499.9,
      active: true,
    },
    {
      id: 6,
      name: "Produto 6",
      price: 599.9,
      active: false,
    }
  ];
  private productsSubject: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>(this.products);
  public products$: Observable<Product[]> = this.productsSubject.asObservable();

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
      // this.loadProducts();
  }

  private loadProducts(): void {
    this.http.get<Product[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error fetching products:', error);
        return throwError(() => new Error('Could not load products. Please try again later.'));
      })
    ).subscribe(products => {      
      this.products = products;
      this.productsSubject.next(products);
    });
  }

  getProducts(): Product[] {
    return this.products;
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${product.id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
