import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { Router } from '@angular/router';  // Para redirigir
import { AuthService } from '../../auth/services/auth.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(
        public layoutService: LayoutService, 
        private authService: AuthService,  // Inyectar el servicio de autenticación
        private router: Router             // Inyectar el router para redirigir
    ) { }

    // Método para cerrar sesión
    logout() {
        // Eliminar datos de sesión del localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('email');
        localStorage.removeItem('password');

        // También limpiar sessionStorage si se está utilizando
        sessionStorage.removeItem('authToken');

        // Redirigir al usuario a la página de login
        this.router.navigate(['/auth/login']);
    }
}
