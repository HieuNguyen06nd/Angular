// src/app/page-category/page-category.component.ts
import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs';
import { Product } from '../../core/models/product.model';
import { Category } from '../../core/models/category.model';
import { CategoryService } from '../../core/services/category.service';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-page-category',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './page-category.component.html',
  styleUrls: ['./page-category.component.css']
})
export class PageCategoryComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  products: Product[] = [];
  categoryId!: number;
  categoryName = '';
  breadcrumb: Category[] = [];
  page = 1;
  perPage = 10;

  private routeSub?: Subscription;

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.categoryService.getRootCategories().subscribe(list => this.categories = list);

    this.routeSub = this.route.params.subscribe(params => {
      this.categoryId = +params['id'];
      this.page = 1;
      this.loadCategoryData(this.categoryId);
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  private loadCategoryData(id: number): void {
    forkJoin({
      cat: this.categoryService.getCategoryById(id),
      path: this.categoryService.getCategoryParents(id)
    }).subscribe(({ cat, path }) => {
      this.categoryName = cat.name;
      this.breadcrumb = path;
    });

    this.loadProducts();
  }

  private loadProducts(): void {
    this.productService.getAllProducts().subscribe(res => {
      const filtered = res.data.filter(p => p.categoryId === this.categoryId);
      this.products = filtered.slice(0, this.page * this.perPage);
    });
  }

  onSelectCategory(catId: number): void {
    this.router.navigate(['/product/category', catId]);
  }

  loadMore(): void {
    this.page++;
    this.loadProducts();
  }
}