import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { RecuperarPassword } from './components/recuperar-password/recuperar-password';
import { MainLayout } from './components/main-layout/main-layout';
import { ProductoLista } from './components/producto-lista/producto-lista';
import { UsuarioLista } from './components/usuario-lista/usuario-lista';
import { MiPerfil } from './components/mi-perfil/mi-perfil';
import { authGuardGuard } from './guards/auth-guard-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'recuperar-password', component: RecuperarPassword },
  {
    path: 'app',
    component: MainLayout,
    canActivate: [authGuardGuard],
    children: [
      { path: '', redirectTo: 'productos', pathMatch: 'full' },
      { path: 'productos', component: ProductoLista },
      { path: 'usuarios', component: UsuarioLista },
      { path: 'perfil', component: MiPerfil }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
