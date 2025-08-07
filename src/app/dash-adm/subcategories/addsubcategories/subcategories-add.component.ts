import { Component, OnInit } from '@angular/core';
import { SubCategoryService, SubCategory } from '../../../shared/services/subcategory.service';
import { CategoryService, Category } from '../../../shared/services/category.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-subcategories-add',
  templateUrl: './subcategories-add.component.html',
  imports: [CommonModule, FormsModule, RouterModule],
  styleUrls: ['./subcategories-add.component.css']
})
export class SubCategoriesAddComponent implements OnInit {
  subcategory: Partial<SubCategory> = {};
  categories: Category[] = [];
  isSubmitting = false;
  error: string | null = null;

  constructor(
    private subCategoryService: SubCategoryService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.categoryService.getAllCategories().subscribe({
      next: (cats) => this.categories = cats,
      error: () => this.categories = []
    });
  }

  submit() {
    if (!this.subcategory.name || !this.subcategory.category) { this.error = 'Nom et catégorie requis'; return; }
    this.isSubmitting = true;
    this.subCategoryService.createSubCategory(this.subcategory as SubCategory).subscribe({
      next: () => this.router.navigate(['/dash-adm/subcategories']),
      error: () => { this.error = 'Erreur création'; this.isSubmitting = false; }
    });
  }
} 