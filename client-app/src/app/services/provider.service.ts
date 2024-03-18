import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import { Provider } from '../models/provider.model';
import { MessageDisplayService } from './message-display.service';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {

  private apiUrl = 'https://localhost:7144/providers';

  private providers: Provider[] = [];
  private providersSubject: BehaviorSubject<Provider[]> = new BehaviorSubject<Provider[]>(this.providers);
  public providers$: Observable<Provider[]> = this.providersSubject.asObservable();

  constructor(private http: HttpClient, private messageDisplayService: MessageDisplayService) { 
    this.loadProviders();
  }

  private loadProviders(): void {
    this.http.get<Provider[]>(this.apiUrl).pipe(
      catchError(error => {
        this.messageDisplayService.displayMessage('Erro carregando fornecedores');
        return throwError(() => new Error(error));
      })
    ).subscribe(providers => {
      this.providers = providers;
      this.providersSubject.next(providers);
    });
  }

  getProvider(id: number): Observable<Provider> {
    return this.providers$.pipe(
      map(providers => providers.find(provider => provider.id === id)!)
    );
  }

}
