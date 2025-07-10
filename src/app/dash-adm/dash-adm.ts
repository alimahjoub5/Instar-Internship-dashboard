import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserComponent } from "./users/user/user.component";
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-dash-adm',
  standalone: true,
  imports: [CommonModule, RouterModule, UserComponent, NavbarComponent, SidebarComponent],
  templateUrl: './dash-adm.html',
  styleUrls: ['./dash-adm.css']
})
export class DashAdmComponent {}
