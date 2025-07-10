import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { DashFnComponent } from './dash-fn/dash-fn';
import { DashAdmComponent } from './dash-adm/dash-adm';
import { UserComponent } from './dash-adm/users/user/user.component';
import { AddUserComponent } from './dash-adm/users/adduser/adduser.component';
import { Reset } from './auth/reset/reset';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'reset', component: Reset },
  { path: 'dash-adm', component: DashAdmComponent },
  { path: 'dash-fn', component: DashFnComponent },
  { path: 'users', component: UserComponent },
  { path: 'users/add', component: AddUserComponent },
  { path: 'users/edit/:userId', component: AddUserComponent },
];
