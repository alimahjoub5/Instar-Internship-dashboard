import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { DashFnComponent } from './dash-fn/dash-fn';
import { DashAdmComponent } from './dash-adm/dash-adm';
import { UserComponent } from './dash-adm/users/user/user.component';
import { AddUserComponent } from './dash-adm/users/adduser/adduser.component';
import { DashboardHomeComponent } from './dash-adm/dashboard-home/dashboard-home';
import { SettingsComponent } from './dash-adm/settings/settings';
import { Reset } from './auth/reset/reset';
import { AuthGuard } from './shared/guards/auth.guard';
import { SupplierListComponent } from './dash-adm/suppliers/supplier-list/supplier-list.component';
import { AddSupplierComponent } from './dash-adm/suppliers/add-supplier/add-supplier.component';
import { SupplierDetailComponent } from './dash-adm/suppliers/supplier-detail/supplier-detail.component';
import { ListeProductComponent } from './dash-adm/products/liste-product/liste-product';
import { AddProductComponent } from './dash-adm/products/add-product/add-product';
import { EditProductComponent } from './dash-adm/products/edit-product/edit-product';
import { ConsultProductComponent } from './dash-adm/products/consult-product/consult-product';
import { Reviews } from './dash-adm/reviews/reviews';
import { CategoriesListComponent } from './dash-adm/categories/categories-list.component';
import { CategoriesAddComponent } from './dash-adm/categories/addcategories/categories-add.component';
import { CategoriesEditComponent } from './dash-adm/categories/editcategories/categories-edit.component';
import { SubCategoriesListComponent } from './dash-adm/subcategories/subcategories-list.component';
import { SubCategoriesAddComponent } from './dash-adm/subcategories/addsubcategories/subcategories-add.component';
import { SubCategoriesEditComponent } from './dash-adm/subcategories/editsubcategories/subcategories-edit.component';
import { SubscriptionListComponent } from './dash-adm/subscriptions/subscription-list/subscription-list.component';
import { CreateSubscriptionComponent } from './dash-adm/subscriptions/create-subscription/create-subscription.component';
import { SubscriptionStatsComponent } from './dash-adm/subscriptions/subscription-stats/subscription-stats.component';
import { SubscriptionDetailsComponent } from './dash-adm/subscriptions/subscription-details/subscription-details.component';
import { SubscriptionPlansListComponent } from './dash-adm/subscriptions/subscription-plans/subscription-plans-list.component';
import { SubscriptionPlanFormComponent } from './dash-adm/subscriptions/subscription-plans/subscription-plan-form.component';
import { SubscriptionExpirationComponent } from './dash-adm/subscriptions/subscription-expiration/subscription-expiration.component';
import { GracePeriodComponent } from './dash-adm/subscriptions/grace-period/grace-period.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'reset', component: Reset },
  { 
    path: 'dash-adm', 
    component: DashAdmComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardHomeComponent },
      { path: 'users', component: UserComponent },
      { path: 'users/add', component: AddUserComponent },
      { path: 'users/edit/:userId', component: AddUserComponent },
      { path: 'suppliers', component: SupplierListComponent },
      { path: 'suppliers/add', component: AddSupplierComponent },
      { path: 'suppliers/edit/:id', component: AddSupplierComponent },
      { path: 'suppliers/:id', component: SupplierDetailComponent },
      { path: 'products', component: ListeProductComponent },
      { path: 'products/add-product', component: AddProductComponent },
      { path: 'products/edit-product/:id', component: EditProductComponent },
      { path: 'products/consult-product/:id', component: ConsultProductComponent },
      { path: 'reviews/:productId', component: Reviews },
      { path: 'settings', component: SettingsComponent },
      { path: 'profile-admin', loadComponent: () => import('./dash-adm/profile-admin/profile-admin.component').then(m => m.ProfileAdminComponent) },
      { path: 'categories', component: CategoriesListComponent },
      { path: 'categories/add', component: CategoriesAddComponent },
      { path: 'categories/edit/:id', component: CategoriesEditComponent },
      { path: 'subcategories', component: SubCategoriesListComponent },
      { path: 'subcategories/add', component: SubCategoriesAddComponent },
      { path: 'subcategories/edit/:id', component: SubCategoriesEditComponent },
      { path: 'subscriptions', component: SubscriptionListComponent },
      { path: 'subscriptions/create', component: CreateSubscriptionComponent },
      { path: 'subscriptions/stats', component: SubscriptionStatsComponent },
      { path: 'subscriptions/plans', component: SubscriptionPlansListComponent },
      { path: 'subscriptions/plans/add', component: SubscriptionPlanFormComponent },
      { path: 'subscriptions/plans/edit/:id', component: SubscriptionPlanFormComponent },
      { path: 'subscriptions/grace-period', component: GracePeriodComponent },
      { path: 'subscriptions/:id', component: SubscriptionDetailsComponent },
    ]
  },
  { path: 'dash-fn', component: DashFnComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
