import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { routes } from './app.routes';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PeticionInterceptor } from './admin/interceptors/peticion.interceptor';  // Asegúrate de que la ruta sea correcta

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptorsFromDi()  // Recoge interceptores desde DI
    ),
    { provide: HTTP_INTERCEPTORS, useClass: PeticionInterceptor, multi: true },  // Usamos la clase PeticionInterceptor
    provideClientHydration(),
    importProvidersFrom(BrowserModule),
    importProvidersFrom(BrowserAnimationsModule)
  ]
};
