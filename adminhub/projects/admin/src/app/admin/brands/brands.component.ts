import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { BrandService } from '../../../../../api/service/brand.service';
import { Brand } from '../../../../../api/model/brand.model';


@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule],
  styleUrls: ['./brands.component.scss'],
})
export class BrandsComponent implements OnInit {
  brands: Brand[] = [];
  filteredBrands: Brand[] = [];
  searchQuery: string = '';

  showAddModal = false;
  showEditModal = false;
  showDeleteModal = false;

  newBrand: Brand = this.createEmptyBrand();
  selectedBrand: Brand = this.createEmptyBrand();
  selectedFile: File | null = null;
  isLoading = false;

  constructor(private brandService: BrandService) {}

  ngOnInit(): void {
    this.loadBrands();
  }

  private createEmptyBrand(): Brand {
    return {
      // Khi tạo mới, id không được gán (hoặc undefined)
      name: '',
      description: '',
      status: false,
      logoUrl: ''
    };
  }

  loadBrands(): void {
    this.isLoading = true;
    this.brandService.getAllBrands().subscribe({
      next: (response) => {
        this.brands = response.data || [];
        this.filteredBrands = [...this.brands];
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading brands:', err);
        this.brands = [];
        this.filteredBrands = [];
        this.isLoading = false;
      }
    });
  }

  onSearch(): void {
    if (!this.searchQuery.trim()) {
      this.filteredBrands = [...this.brands];
      return;
    }
    
    const query = this.searchQuery.toLowerCase();
    this.filteredBrands = this.brands.filter(brand => 
      brand.name.toLowerCase().includes(query) ||
      (brand.description?.toLowerCase().includes(query))
    );
  }

  // Modal control methods
  openAddModal(): void {
    this.newBrand = this.createEmptyBrand();
    this.selectedFile = null;
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  openEditModal(brand: Brand): void {
    // Lấy bản sao của brand được chọn (đã có id hợp lệ)
    this.selectedBrand = { ...brand };
    this.selectedFile = null;
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
  }

  openDeleteModal(brand: Brand): void {
    this.selectedBrand = { ...brand };
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  createBrand(): void {
    if (!this.validateBrand(this.newBrand)) return;

    this.isLoading = true;
    this.brandService.createBrand(this.newBrand, this.selectedFile || undefined).subscribe({
      next: (res) => {
        this.handleBrandCreationSuccess(res.data);
      },
      error: (err: HttpErrorResponse) => {
        this.handleBrandError('creating brand', err);
      }
    });
  }

  updateBrand(): void {
    if (!this.selectedBrand.id || !this.validateBrand(this.selectedBrand)) return;

    this.isLoading = true;
    this.brandService.updateBrand(
      this.selectedBrand.id,
      this.selectedBrand,
      this.selectedFile || undefined,
      true
    ).subscribe({
      next: (res) => {
        this.handleBrandUpdateSuccess(res.data);
      },
      error: (err: HttpErrorResponse) => {
        this.handleBrandError('updating brand', err);
      }
    });
  }

  deleteBrand(): void {
    if (!this.selectedBrand.id) return;

    this.isLoading = true;
    this.brandService.deleteBrand(this.selectedBrand.id).subscribe({
      next: () => {
        this.handleBrandDeletionSuccess();
      },
      error: (err: HttpErrorResponse) => {
        this.handleBrandError('deleting brand', err);
      }
    });
  }

  toggleStatus(brand: Brand): void {
    if (!brand.id) return;

    const updatedBrand = { ...brand, status: !brand.status };
    
    this.brandService.updateBrand(brand.id, updatedBrand).subscribe({
      next: (res) => {
        const index = this.brands.findIndex(b => b.id === brand.id);
        if (index !== -1) {
          this.brands[index] = res.data;
          this.filteredBrands = [...this.brands];
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error updating status:', err);
        // Revert UI change nếu API thất bại
        brand.status = !brand.status;
      }
    });
  }

  private handleBrandCreationSuccess(brand: Brand): void {
    this.brands.push(brand);
    this.filteredBrands = [...this.brands];
    this.closeAddModal();
    this.isLoading = false;
  }

  private handleBrandUpdateSuccess(updatedBrand: Brand): void {
    const index = this.brands.findIndex(b => b.id === updatedBrand.id);
    if (index !== -1) {
      this.brands[index] = updatedBrand;
      this.filteredBrands = [...this.brands];
    }
    this.closeEditModal();
    this.isLoading = false;
  }

  private handleBrandDeletionSuccess(): void {
    this.brands = this.brands.filter(b => b.id !== this.selectedBrand.id);
    this.filteredBrands = [...this.brands];
    this.closeDeleteModal();
    this.isLoading = false;
  }

  private handleBrandError(action: string, error: HttpErrorResponse): void {
    console.error(`Error ${action}:`, error);
    this.isLoading = false;
    // Hiển thị thông báo lỗi cho người dùng nếu cần
  }

  private validateBrand(brand: Brand): boolean {
    // Kiểm tra tên không rỗng
    if (!brand.name.trim()) {
      alert('Tên thương hiệu là bắt buộc');
      return false;
    }
    // Kiểm tra trùng lặp tên:
    // Với tạo mới: brand.id là undefined nên sẽ so sánh với tất cả các brand.
    // Với cập nhật: loại trừ brand có cùng id.
    const duplicate = this.brands.some(existingBrand => 
      existingBrand.name.trim().toLowerCase() === brand.name.trim().toLowerCase() &&
      existingBrand.id !== brand.id
    );
    
    if (duplicate) {
      alert('Tên thương hiệu đã tồn tại, vui lòng chọn tên khác');
      return false;
    }
    return true;
  }
}
