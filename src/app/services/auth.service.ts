import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';
  private isLoggedIn$ = new BehaviorSubject<boolean>(this.hasToken());

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  private hasToken(): boolean {
    return !!localStorage.getItem('authToken');
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn$.value;
  }


  login(user: string, password: string): Observable<boolean> {
    return this.http.get<User[]>(`${this.apiUrl}/users?user=${user}&password=${password}`).pipe(
      map(users => {
        if (users.length > 0) {
          const foundUser = users[0];
          localStorage.setItem('authToken', `fake-token-for-user-${foundUser.id}`);
          this.isLoggedIn$.next(true);
          return true;
        }
        return false;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.isLoggedIn$.next(false);
    this.router.navigate(['/login']);
  }
}

