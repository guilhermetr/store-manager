import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _isAuthenticated: boolean = false;
  private user: User = { username: '' };

  private users = new Map<string, string>([
    ["admin", "admin"],
  ]);

  constructor() { }

  login(username: string, password: string): boolean {
    if (this.users.get(username) == password) {
      this._isAuthenticated = true;
      this.user.username = username;
      return true;
    }
    return false;
  }

  logout(): void {
    this._isAuthenticated = false;
  }

  isAuthenticated(): boolean {
    return this._isAuthenticated;
  }

  getUser(): User {
    return this.user;
  }
 
}
