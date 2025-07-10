import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { DashFnComponent } from './dash-fn/dash-fn';
import { DashAdmComponent } from './dash-adm/dash-adm';
import { UserComponent } from './dash-adm/users/user/user.component';
import { AddUserComponent } from './dash-adm/users/adduser/adduser.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dash-adm', component: DashAdmComponent },
  { path: 'dash-fn', component: DashFnComponent },
  { path: 'users', component: UserComponent },
  { path: 'users/add', component: AddUserComponent },
  { path: 'users/edit/:userId', component: AddUserComponent },
];
