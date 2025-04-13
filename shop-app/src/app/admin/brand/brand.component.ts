import { Component, OnInit } from '@angular/core';
import { Brand } from '../../core/models/brand.model';
import { BrandService } from '../../core/services/brand.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-brand',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.css'],
})
export class BrandComponent implements OnInit {
  brands: Brand[] = [];

  brandForm: FormGroup;
  showForm = false;
  isEditing = false;
  editingIndex: number | null = null;

  previewUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  constructor(
    private brandService: BrandService,
    private fb: FormBuilder
  ) {
    // Khởi tạo form (không cần formControl cho logoUrl vì ta dùng file upload)
    this.brandForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      // logoUrl: [''], // Không cần trường này
      status: ['ACTIVE', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadBrands();
  }

  loadBrands() {
    this.brandService.getAllBrands().subscribe((brands) => {
      this.brands = brands;
    });
  }

  openForm() {
    this.brandForm.reset({ status: 'ACTIVE' });
    this.selectedFile = null;
    this.previewUrl = null;
    this.isEditing = false;
    this.editingIndex = null;
    this.showForm = true;
  }

  cancel() {
    this.showForm = false;
    this.brandForm.reset();
    this.editingIndex = null;
    this.selectedFile = null;
    this.previewUrl = null;
  }

  onSubmit() {
    if (this.brandForm.invalid) return;
    
    const formValue = this.brandForm.value;
  
    // Chuyển đổi status từ "ACTIVE"/"INACTIVE" sang boolean
    const statusBoolean = formValue.status === 'ACTIVE';
  
    let brandData: any = {
      name: formValue.name,
      description: formValue.description,
      status: statusBoolean
    };
  
    // Nếu đang chỉnh sửa, thêm id và giữ logoUrl cũ nếu không có file mới
    if (this.isEditing && this.editingIndex !== null) {
      brandData.id = this.brands[this.editingIndex].id;
      // Nếu không chọn file mới, gán logoUrl cũ để giữ lại ảnh hiện tại
      if (!this.selectedFile && this.previewUrl) {
        brandData.logoUrl = this.previewUrl;
      }
    }
  
    // Tạo FormData và thêm JSON string của brand
    const formData = new FormData();
    formData.append('brand', JSON.stringify(brandData));
  
    // Nếu có file mới được chọn thì thêm vào FormData
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }
  
    if (this.isEditing && this.editingIndex !== null) {
      const brandId = this.brands[this.editingIndex].id;
      // Gọi API update với parameter shouldDeleteOldLogo false nếu bạn muốn giữ logo cũ
      this.brandService.updateBrandWithFile(brandId, formData, false).subscribe((updatedBrand) => {
        this.brands[this.editingIndex!] = updatedBrand;
        this.cancel();
      });
    } else {
      this.brandService.addBrandWithFile(formData).subscribe((newBrand) => {
        this.brands.push(newBrand);
        this.cancel();
      });
    }
  }
  
  
  

  editBrand(index: number) {
    this.isEditing = true;
    this.editingIndex = index;
  
    const brand = this.brands[index];
  
    // Reset form; note rằng logo được cập nhật qua file upload nên ko gán giá trị cho logoUrl
    this.brandForm.setValue({
      name: brand.name || '',
      description: brand.description || '',
      status: brand.status ? 'ACTIVE' : 'INACTIVE',
    });
  
    // Gán ảnh preview từ URL của brand để hiển thị cho người dùng
    this.previewUrl = brand.logoUrl;
    this.selectedFile = null;
    this.showForm = true;
  }
  
  deleteBrand(index: number) {
    const brand = this.brands[index];
    if (confirm(`Are you sure you want to delete brand "${brand.name}"?`)) {
      this.brandService.deleteBrand(brand.id).subscribe(() => {
        this.brands.splice(index, 1);
      });
    }
  }
  
  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
  
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }
}
