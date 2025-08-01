import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category, CategoryService } from '../../../shared/services/category.service';

@Component({
  selector: 'app-categories-edit',
  templateUrl: './categories-edit.component.html',
  imports: [CommonModule, FormsModule, RouterModule],
  styleUrls: ['./categories-edit.component.css']
})
export class CategoriesEditComponent implements OnInit {
  category: Partial<Category> = {};
  isSubmitting = false;
  error: string | null = null;
  id: string | null = null;

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.categoryService.getCategoryById(this.id).subscribe({
        next: (cat: Category) => this.category = cat,
        error: () => this.error = 'Erreur chargement catégorie'
      });
    }
  }

  submit() {
    if (!this.category.title || !this.id) { this.error = 'Nom requis'; return; }
    this.isSubmitting = true;
    this.categoryService.updateCategory(this.id, this.category).subscribe({
      next: () => this.router.navigate(['/dash-adm/categories']),
      error: () => { this.error = 'Erreur modification'; this.isSubmitting = false; }
    });
  }
} 