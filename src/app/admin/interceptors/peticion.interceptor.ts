import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest, HttpEvent } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class PeticionInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, handler: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Request URL:', req.url);

    const peticion = req.clone({
      setHeaders: {
        'Accept': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphbC5wYWNob0B5YXZpcmFjLmVkdS5lYyIsImlkIjozLCJpYXQiOjE3MzM4Njc2MjksImV4cCI6MTczMzg2ODIzNH0.u_6qHNRJejXsjpfOox4ws3x51zgBmdSaCpfIp2LdGFs'
      }
    });

    return handler.handle(peticion).pipe(
      tap(
        () => {},  // No hacemos nada en el éxito
        (error: any) => {  // Manejo de errores
          console.log('Error interceptado:', error);
          if (error instanceof HttpErrorResponse && error.status === 401) {
            console.log('No autorizado');
            this.router.navigate(['auth/login']);
          }
        }
      )
    );
  }
}
