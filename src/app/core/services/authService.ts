import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import {jwtDecode, JwtPayload} from 'jwt-decode';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  roleId?: string;
  role: string;
  permissionIds?: string[];
}
export interface Role {
  id: string;
  name: string;
  permissionIds: string[];
}
export interface Permission {
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl;
  private tokenKey = environment.tokenKey;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser = this.currentUserSubject.asObservable();

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  constructor(private http: HttpClient,private router: Router) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

   login(username: string, password: string): Observable<User> {
    return this.http.get<User[]>(`${this.apiUrl}/users?username=${username}&password=${password}`)
      .pipe(
        tap((users: User[]) => {
          if (users && users.length > 0) {
            const user = users[0];
            localStorage.setItem('user', JSON.stringify(user));
            this.currentUserSubject.next(user);
          }
        }),
        map(users => users[0])
      );
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.apiUrl}/roles`);
  }

  getPermissions(): Observable<Permission[]> {
    return this.http.get<Permission[]>(`${this.apiUrl}/permissions`);
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, user);
  }
  updateUser(id: number, user: User): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/users/${id}`, user);
  }
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`);
  }

  addRole(role: Role): Observable<Role> {
    return this.http.post<Role>(`${this.apiUrl}/roles`, role);
  }

  updateRole(roleId: number, role: Role): Observable<Role> {
    return this.http.patch<Role>(`${this.apiUrl}/roles/${roleId}`, role);
  }

  deleteRole(roleId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/roles/${roleId}`);
  }

  getRolePermissions(roleId: string): Observable<Permission[]> {
    return this.http.get<Permission[]>(`${this.apiUrl}/roles/${roleId}/permissions`);
  } 



  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey) && !!localStorage.getItem('user');
  }

  private decodeToken(token: string): User | null {
    try {
      return jwtDecode<User>(token);
    } catch (error) {
      console.error('Invalid token', error);
      return null;
    }
  }

}
