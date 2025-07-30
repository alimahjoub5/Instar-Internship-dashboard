import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { DashFn } from './dash-fn/dash-fn';
import { DashAdmComponent } from './dash-adm/dash-adm';
import { UserComponent } from './dash-adm/users/user/user.component';
import { AddUserComponent } from './dash-adm/users/adduser/adduser.component';
import { ProductComponent } from './dash-adm/products/product.component';
import { AddProductComponent } from './dash-adm/products/addproduct/addproduct';
import { DashboardHomeComponent } from './dash-adm/dashboard-home/dashboard-home';
import { SettingsComponent } from './dash-adm/settings/settings';
import { Reset } from './auth/reset/reset';
import { AuthGuard } from './shared/guards/auth.guard';
import { Sidebar } from './dash-fn/sidebar/sidebar';
import { ProfileComponent } from './dash-fn/profile/profile';
import { Products } from './dash-fn/products/products';
import { Dashboard } from './dash-fn/dashboard/dashboard';
import { TestcompComponent } from './testcomp/testcomp.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'reset', component: Reset },
  { 
    path: 'dash-adm', 
    component: DashAdmComponent,
    // canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardHomeComponent },
      { path: 'users', component: UserComponent },
      { path: 'users/add', component: AddUserComponent },
      { path: 'users/edit/:userId', component: AddUserComponent },
      { path: 'products', component: ProductComponent },
      { path: 'products/add', component: AddProductComponent },
      { path: 'settings', component: SettingsComponent }
    ]
  },

  { path: 'dash-fn', component: DashFn,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ]
   },
  { path: 'sidebar', component: Sidebar },
  {path : 'profile', component:ProfileComponent},
  {path : 'products', component:Products},
  {path : 'dashboard', component:Dashboard},
  {path : 'testcomp', component:TestcompComponent},
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
