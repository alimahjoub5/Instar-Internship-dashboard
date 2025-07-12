import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-dash-adm',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent,
    SidebarComponent
  ],
  templateUrl: './dash-adm.html',
  styleUrls: ['./dash-adm.css']
})
export class DashAdmComponent {
  // This component now serves as a layout wrapper
  // All navigation is handled by the router
}
