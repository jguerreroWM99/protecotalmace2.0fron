import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AuthService } from '../../services/auth-services';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatTooltipModule
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout implements OnInit {
  authService = inject(AuthService);
  private router = inject(Router);
  private breakpointObserver = inject(BreakpointObserver);

  usuario = this.authService.obtenerUsuarioActual();
  modoOscuro = false;
  esPantallaPequena = false;
  menuExpandido = true;

  ngOnInit(): void {
    const guardado = localStorage.getItem('almacen_tema_oscuro');
    this.modoOscuro = guardado === 'true';
    this.aplicarTema();

    this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.TabletPortrait])
      .subscribe(result => {
        this.esPantallaPequena = result.matches;
        this.menuExpandido = !result.matches;
      });
  }

  toggleMenu(): void {
    this.menuExpandido = !this.menuExpandido;
  }

  cerrarSiEsMovil(): void {
    if (this.esPantallaPequena) {
      this.menuExpandido = false;
    }
  }

  toggleTema(): void {
    this.modoOscuro = !this.modoOscuro;
    localStorage.setItem('almacen_tema_oscuro', String(this.modoOscuro));
    this.aplicarTema();
  }

  private aplicarTema(): void {
    if (this.modoOscuro) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }

  cerrarSesion(): void {
    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
  }
}
