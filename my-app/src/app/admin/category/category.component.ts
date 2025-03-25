import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Category {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  parentId?: number | null;
  children?: Category[];
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
  expanded?: boolean;
}

interface Activity {
  title: string;
  description?: string;
  date: Date;
}

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CategoryComponent implements OnInit {
  // Data
  categories: Category[] = [];
  rootCategories: Category[] = [];
  
  // Stats
  totalCategories = 0;
  topLevelCategories = 0;
  activeCategories = 0;
  
  // Search
  searchQuery = '';
  
  // Modals
  showModal = false;
  showDeleteModal = false;
  modalTitle = 'Add New Category';
  
  // Current category
  currentCategory: Partial<Category> = {
    status: 'active',
    icon: 'bx bxs-category'
  };
  deleteCategoryId: number | null = null;
  
  // Activity log
  recentActivities: Activity[] = [
    {
      title: 'Category updated: Electronics',
      date: new Date('2025-03-25T16:41:09')
    },
    {
      title: 'New category added',
      description: 'Electronics category created',
      date: new Date()
    },
    {
      title: 'Subcategory added',
      description: 'Added "Laptops" under Computers',
      date: new Date(Date.now() - 86400000) // Yesterday
    }
  ];

  ngOnInit(): void {
    this.loadCategories();
  }
  
  loadCategories() {
    // Sample data
    this.categories = [
      { 
        id: 1, 
        name: "Electronics", 
        description: "Electronic devices", 
        icon: "bx bxs-category",
        parentId: null, 
        status: "inactive",
        expanded: false,
        children: [
          { 
            id: 4, 
            name: "Computers", 
            description: "Desktop and laptop computers", 
            icon: "bx bx-desktop",
            parentId: 1, 
            status: "active",
            expanded: false,
            children: [
              { 
                id: 6, 
                name: "Laptops", 
                description: "Portable computers", 
                icon: "bx bx-laptop",
                parentId: 4, 
                status: "active",
                children: [] 
              }
            ] 
          },
          { 
            id: 5, 
            name: "Mobile Phones", 
            description: "Smartphones and feature phones", 
            icon: "bx bx-mobile-alt",
            parentId: 1, 
            status: "active",
            children: [] 
          }
        ] 
      },
      { 
        id: 2, 
        name: "Clothing", 
        description: "Apparel items", 
        icon: "bx bx-t-shirt",
        parentId: null, 
        status: "active",
        children: [] 
      },
      { 
        id: 3, 
        name: "Home & Garden", 
        description: "Home products", 
        icon: "bx bx-home-alt",
        parentId: null, 
        status: "inactive",
        children: [] 
      }
    ];
    
    this.rootCategories = this.categories.filter(c => !c.parentId);
    this.calculateStats();
  }
  
  // Helper methods
  calculateStats() {
    this.topLevelCategories = this.rootCategories.length;
    this.totalCategories = this.countCategories(this.categories);
    this.activeCategories = this.countActiveCategories(this.categories);
  }
  
  private countCategories(categories: Category[]): number {
    return categories.reduce((count, category) => {
      return count + 1 + (category.children ? this.countCategories(category.children) : 0);
    }, 0);
  }
  
  private countActiveCategories(categories: Category[]): number {
    return categories.reduce((count, category) => {
      return count + 
        (category.status === 'active' ? 1 : 0) + 
        (category.children ? this.countActiveCategories(category.children) : 0);
    }, 0);
  }
  
  get availableParents(): Category[] {
    return this.categories.filter(c => !this.currentCategory.id || c.id !== this.currentCategory.id);
  }
  
  // Tree operations
  toggleExpand(category: Category) {
    category.expanded = !category.expanded;
  }
  
  expandAll() {
    this.setAllExpanded(this.categories, true);
  }
  
  collapseAll() {
    this.setAllExpanded(this.categories, false);
  }
  
  private setAllExpanded(categories: Category[], expanded: boolean) {
    categories.forEach(category => {
      if (category.children?.length) {
        category.expanded = expanded;
        this.setAllExpanded(category.children, expanded);
      }
    });
  }
  
  // Modal operations
  openAddModal() {
    this.modalTitle = 'Add New Category';
    this.currentCategory = {
      status: 'active',
      icon: 'bx bxs-category',
      parentId: null
    };
    this.showModal = true;
  }
  
  openEditModal(category: Category) {
    this.modalTitle = 'Edit Category';
    this.currentCategory = { ...category };
    this.showModal = true;
  }
  
  openDeleteModal(categoryId: number) {
    this.deleteCategoryId = categoryId;
    this.showDeleteModal = true;
  }
  
  closeModal() {
    this.showModal = false;
  }
  
  closeDeleteModal() {
    this.showDeleteModal = false;
  }
  
  // Category operations
  saveCategory() {
    if (this.currentCategory.id) {
      this.updateCategory();
    } else {
      this.addCategory();
    }
    this.closeModal();
  }
  
  private updateCategory() {
    const category = this.findCategoryById(this.currentCategory.id!);
    if (category) {
      Object.assign(category, this.currentCategory);
      this.addActivity(`Category updated: ${category.name}`);
    }
  }
  
  private addCategory() {
    const newId = Math.max(...this.categories.map(c => c.id), 0) + 1;
    const newCategory: Category = {
      id: newId,
      name: this.currentCategory.name!,
      description: this.currentCategory.description,
      icon: this.currentCategory.icon || 'bx bxs-category',
      parentId: this.currentCategory.parentId || null,
      status: this.currentCategory.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      children: []
    };
    
    this.categories.push(newCategory);
    
    if (!newCategory.parentId) {
      this.rootCategories.push(newCategory);
    }
    
    this.addActivity(`New category added: ${newCategory.name}`);
    this.calculateStats();
  }
  
  confirmDelete() {
    if (this.deleteCategoryId) {
      const category = this.findCategoryById(this.deleteCategoryId);
      if (category) {
        this.addActivity(`Category deleted: ${category.name}`);
        
        // Remove from parent's children or root categories
        if (category.parentId) {
          const parent = this.findCategoryById(category.parentId);
          if (parent?.children) {
            parent.children = parent.children.filter(c => c.id !== category.id);
          }
        } else {
          this.rootCategories = this.rootCategories.filter(c => c.id !== category.id);
        }
        
        // Remove from flat list
        this.categories = this.categories.filter(c => c.id !== category.id);
        
        this.calculateStats();
      }
      this.closeDeleteModal();
    }
  }
  
  // Helper methods
  private findCategoryById(id: number, categories = this.categories): Category | undefined {
    for (const category of categories) {
      if (category.id === id) return category;
      if (category.children) {
        const found = this.findCategoryById(id, category.children);
        if (found) return found;
      }
    }
    return undefined;
  }
  
  private addActivity(title: string, description?: string) {
    this.recentActivities.unshift({
      title,
      description,
      date: new Date()
    });
    
    // Keep only last 5 activities
    if (this.recentActivities.length > 5) {
      this.recentActivities.pop();
    }
  }
}