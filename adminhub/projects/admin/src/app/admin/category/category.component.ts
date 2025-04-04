import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../../../../api/service/category.service';
import { Category } from '../../../../../api/model/category.model'; 

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  categories: Category[] = [];
  searchQuery: string = '';
  showAddModal: boolean = false;
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;
  categoryToDelete: Category | null = null;
  hasSubcategories: boolean = false;
  
  addForm: FormGroup;
  editForm: FormGroup;
  expandedState: { [key: number]: boolean } = {};
  
  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService
  ) {
    // Khởi tạo form thêm danh mục mới
    this.addForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      icon: [''],
      parentId: [null]  // Nếu muốn thêm danh mục con, nhập ID của cha
    });
    
    // Khởi tạo form chỉnh sửa danh mục
    this.editForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      description: [''],
      icon: [''],
      parentId: [null]
    });
  }
  
  ngOnInit(): void {
    this.loadCategories();
  }
  
  // Gọi API BE để lấy danh sách danh mục gốc
  loadCategories(): void {
    this.categoryService.getRootCategories().subscribe({
      next: res => {
        if (res.status === 200) {
          this.categories = res.data;
        } else {
          console.error('Error loading categories:', res.message);
        }
      },
      error: err => console.error('API error:', err)
    });
  }
  
  isDuplicateCategoryName(name: string, id?: number): boolean {
    return this.categories.some(cat => cat.name.toLowerCase() === name.toLowerCase() && cat.id !== id);
  }
  // -------------------- FORM METHODS --------------------
  
  openAddForm(): void {
    this.showAddModal = true;
    this.addForm.reset({
      parentId: null,
      description: '',
      icon: ''
    });
  }
  
  submitAddForm(): void {
    if (this.addForm.invalid) return;

    const name = this.addForm.value.name;
    if (this.isDuplicateCategoryName(name)) {
      alert('Tên danh mục đã tồn tại!');
      return;
    }
    
    this.categoryService.createCategory(this.addForm.value).subscribe({
      next: res => {
        if (res.status === 200) {
          this.loadCategories();
          this.showAddModal = false;
        } else {
          console.error('Error creating category:', res.message);
        }
      },
      error: err => console.error('API error:', err)
    });
  }
  
  openEditForm(category: Category): void {
    this.showEditModal = true;
    this.editForm.patchValue({
      id: category.id,
      name: category.name,
      description: category.description,
      icon: category.icon,
      // Nếu có thông tin danh mục cha, bạn có thể cập nhật ở đây
      parentId: category.parent ? category.parent.id : null
    });
  }
  
  submitEditForm(): void {
    if (this.editForm.invalid) return;
    
    const updatedCategory = this.editForm.value;
    if (this.isDuplicateCategoryName(updatedCategory.name, updatedCategory.id)) {
      alert('Tên danh mục đã tồn tại!');
      return;
    }
    this.categoryService.updateCategory(updatedCategory.id, updatedCategory).subscribe({
      next: res => {
        if (res.status === 200) {
          this.loadCategories();
          this.showEditModal = false;
        } else {
          console.error('Error updating category:', res.message);
        }
      },
      error: err => console.error('API error:', err)
    });
  }
  
  // -------------------- TREE METHODS --------------------
  
  expandAll(): void {
    const expandRecursive = (cats: Category[]) => {
      cats.forEach(cat => {
        this.expandedState[cat.id] = true;
        if (cat.children && cat.children.length) {
          expandRecursive(cat.children);
        }
      });
    };
    expandRecursive(this.categories);
  }
  
  collapseAll(): void {
    this.expandedState = {};
  }
  
  isExpanded(categoryId: number): boolean {
    return !!this.expandedState[categoryId];
  }
  
  toggleExpand(categoryId: number): void {
    this.expandedState[categoryId] = !this.expandedState[categoryId];
  }
  
  // -------------------- HELPER METHODS --------------------
  
  // Danh mục gốc được hiển thị là toàn bộ danh sách categories
  get rootCategories(): Category[] {
    return this.categories;
  }
  
  // Ví dụ tính tổng số danh mục (đệ quy nếu có con)
  get activeCategories(): number {
    let count = 0;
    const countRecursive = (cats: Category[]) => {
      cats.forEach(cat => {
        count++;
        if (cat.children && cat.children.length) {
          countRecursive(cat.children);
        }
      });
    };
    countRecursive(this.categories);
    return count;
  }
  
  get availableParentCategories(): Category[] {
    // Giả sử danh mục gốc có thể làm danh mục cha
    return this.categories;
  }
  
  get canChangeParent(): boolean {
    const id = this.editForm.get('id')?.value;
    const category = this.findCategoryById(id);
    return !(category?.children && category.children.length > 0);
  }
  
  private findCategoryById(id: number): Category | undefined {
    const findRecursive = (cats: Category[]): Category | undefined => {
      for (let cat of cats) {
        if (cat.id === id) return cat;
        if (cat.children) {
          const found = findRecursive(cat.children);
          if (found) return found;
        }
      }
      return undefined;
    };
    return findRecursive(this.categories);
  }
  
  // -------------------- DELETE METHODS --------------------
  
  confirmDelete(category: Category): void {
    this.categoryToDelete = category;
    this.hasSubcategories = !!(category.children && category.children.length);
    this.showDeleteModal = true;
  }
  
  confirmDeleteAction(): void {
    if (!this.categoryToDelete) return;
    
    this.categoryService.deleteCategory(this.categoryToDelete.id).subscribe({
      next: res => {
        if (res.status === 200) {
          this.loadCategories();
          this.showDeleteModal = false;
          this.categoryToDelete = null;
        } else {
          console.error('Error deleting category:', res.message);
        }
      },
      error: err => console.error('API error:', err)
    });
  }
  
  closeAddForm(): void { this.showAddModal = false; }
  closeEditForm(): void { this.showEditModal = false; }
  closeDeleteModal(): void { this.showDeleteModal = false; }
}

