import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../users/user.service';
import { User } from '../users/user.model';

@Component({
  selector: 'app-profile-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-admin.component.html',
  styleUrls: ['./profile-admin.component.css']
})
export class ProfileAdminComponent implements OnInit {
  admin: User | null = null;
  loading = true;

  constructor(private userService: UserService) {}

  ngOnInit() {
    // À adapter selon la logique d'authentification : ici on suppose que l'admin est le user connecté
    const adminId = localStorage.getItem('adminId'); // à remplacer par la vraie logique
    if (adminId) {
      this.userService.getUserById(adminId).subscribe({
        next: (user) => {
          this.admin = user;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
    }
  }
} 