import { Component, OnInit } from '@angular/core';
import { SubCategory, SubCategoryService } from '../../shared/services/subcategory.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-subcategories-list',
  templateUrl: './subcategories-list.component.html',
  imports: [CommonModule, FormsModule, RouterModule],
  styleUrls: ['./subcategories-list.component.css']
})
export class SubCategoriesListComponent implements OnInit {
  subcategories: SubCategory[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(private subCategoryService: SubCategoryService, private router: Router) {}

  ngOnInit() {
    this.fetchSubCategories();
  }

  fetchSubCategories() {
    this.isLoading = true;
    this.subCategoryService.getAllSubCategories().subscribe({
      next: (subs) => { this.subcategories = subs; this.isLoading = false; },
      error: () => { this.error = 'Erreur de chargement'; this.isLoading = false; }
    });
  }

  deleteSubCategory(id: string | undefined) {
    if (!id) return;
    if (confirm('Supprimer cette sous-catégorie ?')) {
      this.subCategoryService.deleteSubCategory(id).subscribe({
        next: () => this.fetchSubCategories(),
        error: () => alert('Erreur suppression')
      });
    }
  }

  goToAdd() { this.router.navigate(['/dash-adm/subcategories/add']); }
  goToEdit(id: string | undefined) { if (id) this.router.navigate(['/dash-adm/subcategories/edit', id]); }
} 