import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { UserService, User } from '../../shared/services/user.service';
import { OnInit } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { SharedModule } from "../../shared/shared.module";
import { Sidebar } from '../sidebar/sidebar';
import { FnFooter } from '../fn-footer/fn-footer';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    Sidebar,
    MatCardModule, MatDividerModule, MatIconModule, TitleCasePipe, CommonModule, SharedModule, FnFooter
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class ProfileComponent implements OnInit {
  user: Partial<User> = {};
  is2FAEnabled: boolean = false;

  constructor(private userService: UserService) {}

  ngOnInit() {
    // For now, mock user data. Replace with real fetch logic as needed.
    this.user = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      address: '123 Main St',
      phone: '+1234567890',
      imageUrl: 'https://i.pravatar.cc/150?img=3',
      role: 'user'
    };
    
    // this.userService.getProfileById('USER_ID').subscribe(u => this.user = u);
  }

  activate2FA() {
    this.is2FAEnabled = true;
  }

  deactivate2FA() {
    this.is2FAEnabled = false;
  }
}
