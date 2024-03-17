import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';
import { Provider } from '../models/provider.model';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {

  private apiUrl = 'http://localhost:7297/providers';

  private providers: Provider[] = [
    {
      id: 1,
      name: "Fornecedor 1",
    },
    {
      id: 2,
      name: "Fornecedor 2",
    },
    {
      id: 3,
      name: "Fornecedor 3",
    },
    {
      id: 4,
      name: "Fornecedor 4",
    },
    {
      id: 5,
      name: "Fornecedor 5",
    },
  ];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
      // this.loadProviders();
  }

  private loadProviders(): void {
    this.http.get<Provider[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error fetching providers:', error);
        return throwError(() => new Error('Could not load providers. Please try again later.'));
      })
    ).subscribe(providers => {
      this.providers = providers;
    });
  }

  getProviders(): Provider[] {
    return this.providers;
  }

  getProvider(id: number): Provider | undefined {
    return this.providers.find(provider => provider.id == id);
  }

}
