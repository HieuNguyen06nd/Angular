import { Injectable } from '@angular/core';

interface Tokens {
  accessToken: string;
  refreshToken?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  private readonly ACCESS_TOKEN_KEY = 'auth_access_token';
  private readonly REFRESH_TOKEN_KEY = 'auth_refresh_token';
  private readonly USER_KEY = 'auth_current_user';

  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private currentUser: any = null;

  constructor() {
    this.loadInitialState();
  }

  private loadInitialState(): void {
    if (this.isLocalStorageAvailable()) {
      this.accessToken = localStorage.getItem(this.ACCESS_TOKEN_KEY);
      this.refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
      
      const userData = localStorage.getItem(this.USER_KEY);
      this.currentUser = userData ? JSON.parse(userData) : null;
    }
  }

  private isLocalStorageAvailable(): boolean {
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }

  saveTokens(tokens: Tokens): void {
    this.accessToken = tokens.accessToken;
    this.refreshToken = tokens.refreshToken || null;

    if (this.isLocalStorageAvailable()) {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, tokens.accessToken);
      if (tokens.refreshToken) {
        localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
      }
    }
  }

  saveUser(user: any): void {
    this.currentUser = user;
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  getRefreshToken(): string | null {
    return this.refreshToken;
  }

  getUser(): any {
    return this.currentUser;
  }

  clear(): void {
    this.accessToken = null;
    this.refreshToken = null;
    this.currentUser = null;

    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
  }
}