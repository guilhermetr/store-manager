import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Observable, map, catchError, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MessageDisplayService } from './message-display.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:5098/auth';

  private _isAuthenticated: boolean = false;
  private user: User = { username: '' };

  constructor(private http: HttpClient, private messageDisplayService: MessageDisplayService) { }

  login(username: string, password: string): Observable<boolean> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password }).pipe(
      map((response: any) => {
        if (response && response.token) {
          this._isAuthenticated = true;
          this.user.username = username;
          localStorage.setItem('token', response.token);
          return true;
        } else {
          return false;
        }
      }),
      catchError(error => {
        this.messageDisplayService.displayMessage(error.error);
        return of(false);
      })
    );
  }

  logout(): void {
    this._isAuthenticated = false;
    localStorage.removeItem('token');
  }

  register(username: string, password: string): Observable<boolean> {
    return this.http.post<any>(`${this.apiUrl}/register`, { username, password }).pipe(
      map(response => {
        return true;
      }),
      catchError(error => {
        this.messageDisplayService.displayMessage(error.error);
        return of(false);
      })
    );
  }

  isAuthenticated(): boolean {
    return this._isAuthenticated;
  }

  getUser(): User {
    return this.user;
  }
 
}
