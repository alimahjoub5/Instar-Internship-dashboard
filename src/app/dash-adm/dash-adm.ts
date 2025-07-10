import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { UserComponent } from "./users/user/user.component";
import { AddUserComponent } from "./users/adduser/adduser.component";
import { DeleteDialogComponent } from "./users/delete-dialog/delete-dialog.component";
import { ProductComponent } from "./products/product.component";
import { AddProductComponent } from './products/addproduct/addproduct';

@Component({
  selector: 'app-dash-adm',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NavbarComponent,
    SidebarComponent,
    UserComponent,
    AddUserComponent,
    ProductComponent,
    AddProductComponent
],
  templateUrl: './dash-adm.html',
  styleUrls: ['./dash-adm.css']
})
export class DashAdmComponent {
  currentView: string = 'users'; // Default view

  showUsers() {
    this.currentView = 'users';
  }

  showAddUser() {
    this.currentView = 'adduser';
  }

  showDashboard() {
    this.currentView = 'dashboard';
  }

  showSettings() {
    this.currentView = 'settings';
  }

  showProducts() {
    this.currentView = 'products';
  }

  showAddProduct() {
    this.currentView = 'addproduct';
  }

  onViewChange(view: string) {
    this.currentView = view;
  }
}
