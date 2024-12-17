import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';  // Asegúrate de importar esta línea
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    // Verificar si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      
      if (token) {
        // Si el token está presente, redirigir al usuario a la página de administración
        this.router.navigate(['/admin']);
      }
    }
  }
}
