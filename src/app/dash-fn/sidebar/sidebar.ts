import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-sidebarfn',
  standalone: true,
  imports: [
    MatSidenavModule, MatButtonModule, MatToolbarModule, MatIconModule,
    MatListModule, MatFormFieldModule, MatInputModule, MatMenuModule,
    RouterModule
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  showFiller = false;

  logout() {
    // TODO: Implement logout logic
    console.log('Logout clicked');
  }
}
