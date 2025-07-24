import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Category, CategoryService } from '../../../shared/services/category.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-categories-add',
  templateUrl: './categories-add.component.html',
  imports: [CommonModule, FormsModule, RouterModule],
  styleUrls: ['./categories-add.component.css']
})
export class CategoriesAddComponent {
  category: Partial<Category> = {};
  isSubmitting = false;
  error: string | null = null;


  selectLogo(logo: string) {
    this.category.image = logo;
  }

  constructor(private categoryService: CategoryService, private router: Router) {}

  submit() {
    if (!this.category.name) { this.error = 'Nom requis'; return; }
    this.isSubmitting = true;
    this.categoryService.createCategory(this.category as Category).subscribe({
      next: () => this.router.navigate(['/dash-adm/categories']),
      error: () => { this.error = 'Erreur création'; this.isSubmitting = false; }
    });
  }
} 