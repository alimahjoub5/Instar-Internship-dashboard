import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category, CategoryService } from '../../shared/services/category.service';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  imports: [CommonModule, FormsModule, RouterModule],
  styleUrls: ['./categories-list.component.css']
})
export class CategoriesListComponent implements OnInit {
  categories: Category[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(private categoryService: CategoryService, private router: Router) {}

  ngOnInit() {
    this.fetchCategories();
  }

  fetchCategories() {
    this.isLoading = true;
    this.categoryService.getAllCategories().subscribe({
      next: (cats) => { this.categories = cats; this.isLoading = false; },
      error: () => { this.error = 'Erreur de chargement'; this.isLoading = false; }
    });
  }

  deleteCategory(id: string | undefined) {
    if (!id) return;
    if (confirm('Supprimer cette catégorie ?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => this.fetchCategories(),
        error: () => alert('Erreur suppression')
      });
    }
  }

  goToAdd() { this.router.navigate(['/dash-adm/categories/add']); }
  goToEdit(id: string | undefined) { if (id) this.router.navigate(['/dash-adm/categories/edit', id]); }
} 