import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = "http://127.0.0.1:3000"; // Solo para pruebas, debería ir la URL del servidor real

  private http = inject(HttpClient);

  constructor() { }

  // Login
  loginConNest(credenciales: any) {
    return this.http.post<any>(`${this.baseUrl}/auth/login`, credenciales); 
  }

  // Registro
  registroConNest(datos: any) {
    return this.http.post<any>(`${this.baseUrl}/auth/register`, datos);
  }

  // Olvidé mi contraseña
  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/forgot-password`, { email });
  }

  // Restablecer la contraseña
  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/reset-password`, { token, newPassword });
  }
  
  // Cerrar sesión (logout)
  logout(): void {
    // Limpiar localStorage y sessionStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('email');
    localStorage.removeItem('password');

    sessionStorage.removeItem('authToken');

    // Si necesitas hacer alguna llamada al backend para invalidar el token, puedes hacerlo aquí
    // Por ejemplo, una posible implementación podría ser:
    // return this.http.post<any>(`${this.baseUrl}/auth/logout`, {});
  }
}
