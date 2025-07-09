import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { DashAdmComponent } from './dash-adm/dash-adm';
import { DashFnComponent } from './dash-fn/dash-fn';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dash-adm', component: DashAdmComponent },
  { path: 'dash-fn', component: DashFnComponent },
];
