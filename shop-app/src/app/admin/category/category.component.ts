import { Component, OnInit } from '@angular/core';
import { Category } from '../../core/models/category.model';
import { CategoryService } from '../../core/services/category.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  categories: Category[] = [];
  totalCategories = 0;
  topLevel = 0;
  subCategories = 0;
  searchKeyword: string = '';

  categoryForm!: FormGroup;
  isEditMode = false;
  currentCategoryId: number | null = null;
  showCategoryForm = false; // ✅ Thêm cờ hiển thị modal

  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      icon: [''],
      description: [''],
      parentId: [null] ,
      active: [true]
    });
  }

  loadCategories(): void {
    this.categoryService.getRootCategories().subscribe(data => {
      this.categories = this.addCollapsedProperty(data);
      this.calculateStats();
    });
  }

  private addCollapsedProperty(categories: Category[]): Category[] {
    return categories.map(cat => {
      return {
        ...cat,
        collapsed: false,
        children: cat.children ? this.addCollapsedProperty(cat.children) : []
      };
    });
  }

  calculateStats(): void {
    let total = 0;
    let subs = 0;
    const countCategories = (cats: Category[]) => {
      cats.forEach(cat => {
        total++;
        if (cat.children && cat.children.length) {
          subs += cat.children.length;
          countCategories(cat.children);
        }
      });
    };
    countCategories(this.categories);
    this.totalCategories = total;
    this.topLevel = this.categories.length;
    this.subCategories = subs;
  }

  toggleNode(cat: Category): void {
    cat.collapsed = !cat.collapsed;
  }

  expandAll(): void {
    const expand = (cats: Category[]) => {
      cats.forEach(cat => {
        cat.collapsed = false;
        if (cat.children && cat.children.length) {
          expand(cat.children);
        }
      });
    };
    expand(this.categories);
  }

  collapseAll(): void {
    const collapse = (cats: Category[]) => {
      cats.forEach(cat => {
        cat.collapsed = true;
        if (cat.children && cat.children.length) {
          collapse(cat.children);
        }
      });
    };
    collapse(this.categories);
  }

  onSearch(event: any): void {
    this.searchKeyword = event.target.value.toLowerCase();
  }

  addCategory(): void {
    this.isEditMode = false;
    this.currentCategoryId = null;
    this.categoryForm.reset({ active: true });
    this.showCategoryForm = true; // ✅ Hiện form
  }

  editCategory(cat: Category): void {
    this.isEditMode = true;
    this.currentCategoryId = cat.id;
    this.categoryForm.patchValue({
      name: cat.name,
      icon: cat.icon,
      description: cat.description,
      active: cat.active,
      parentId: cat.parent?.id || null
    });
    this.showCategoryForm = true;
  }
  

  deleteCategory(cat: Category): void {
    if (confirm(`Are you sure you want to delete "${cat.name}"?`)) {
      this.categoryService.deleteCategory(cat.id).subscribe(() => {
        this.loadCategories();
      });
    }
  }

onSubmit(): void {
  if (this.categoryForm.invalid) return;
  const formValue = this.categoryForm.value;

  if (this.isEditMode && this.currentCategoryId !== null) {
    this.categoryService.updateCategory(this.currentCategoryId, formValue).subscribe(() => {
      this.loadCategories();
      this.cancelCategoryForm();
    });
  } else {
    this.categoryService.createCategory(formValue).subscribe(() => {
      this.loadCategories();
      this.cancelCategoryForm();
    });
  }
}


  cancelCategoryForm(): void {
    this.showCategoryForm = false;
    this.categoryForm.reset({ active: true });
  }
}
