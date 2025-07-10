import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from "./users/user/user.component";

@Component({
  selector: 'app-dash-adm',
  standalone: true,
  imports: [CommonModule, UserComponent],
  templateUrl: './dash-adm.html',
  styleUrls: ['./dash-adm.css']
})
export class DashAdmComponent {}
