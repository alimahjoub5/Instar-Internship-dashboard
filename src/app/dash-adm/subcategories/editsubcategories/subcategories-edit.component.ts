import { Component, OnInit } from '@angular/core';
import { SubCategoryService, SubCategory } from '../../../shared/services/subcategory.service';
import { CategoryService, Category } from '../../../shared/services/category.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-subcategories-edit',
  templateUrl: './subcategories-edit.component.html',
  imports: [CommonModule, FormsModule, RouterModule],
  styleUrls: ['./subcategories-edit.component.css']
})
export class SubCategoriesEditComponent implements OnInit {
  subcategory: Partial<SubCategory> = {};
  categories: Category[] = [];
  isSubmitting = false;
  error: string | null = null;
  id: string | null = null;

  constructor(
    private subCategoryService: SubCategoryService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.categoryService.getAllCategories().subscribe({
      next: (cats) => this.categories = cats,
      error: () => this.categories = []
    });
    if (this.id) {
      this.subCategoryService.getSubCategoryById(this.id).subscribe({
        next: (sub) => this.subcategory = sub,
        error: () => this.error = 'Erreur chargement sous-catégorie'
      });
    }
  }

  submit() {
    if (!this.subcategory.name || !this.subcategory.category || !this.id) { this.error = 'Nom et catégorie requis'; return; }
    this.isSubmitting = true;
    this.subCategoryService.updateSubCategory(this.id, this.subcategory).subscribe({
      next: () => this.router.navigate(['/dash-adm/subcategories']),
      error: () => { this.error = 'Erreur modification'; this.isSubmitting = false; }
    });
  }
} 