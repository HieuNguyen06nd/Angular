import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DiscountService } from '../../core/services/discount.service';
import { ProductService } from '../../core/services/product.service';
import { DiscountResponse, DiscountRequest, DiscountType, ApplicableType } from '../../core/models/discount.models';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-discount',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.css']
})
export class DiscountComponent implements OnInit {
  discounts: DiscountResponse[] = [];
  products: Product[] = [];
  showModal = false;
  isEditMode = false;
  selectedDiscount!: DiscountResponse;
  ApplicableType = ApplicableType;

  // Enum references for template
  discountTypes = Object.values(DiscountType);
  applicableTypes = Object.values(ApplicableType);

  discountForm: FormGroup;

  applicableTypeLabels: Record<ApplicableType, string> = {
    [ApplicableType.PRODUCT]: 'Sản phẩm',
    [ApplicableType.ORDER]: 'Đơn hàng'
  };

  isSubmitting = false;

  totalSelectedPrice = 0;

  constructor(
    private fb: FormBuilder,
    private discountService: DiscountService,
    private productService: ProductService
  ) {
    this.discountForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^[A-Z0-9_-]+$/)]],
      name: ['', Validators.required],
      description: [''],
      value: [null, [Validators.required, Validators.min(0)]],
      type: [DiscountType.PERCENTAGE, Validators.required],
      validFrom: [null, [Validators.required, this.futureDateValidator()]],
      validTo: [null, [Validators.required, this.futureDateValidator()]],
      applicableTo: [ApplicableType.PRODUCT, Validators.required],
      applicableProductIds: [[]],
      minOrderAmount: [null],
      isActive: [true],
      _calculatedAmount: [0],  // Giá trị tiền tính từ %
      _calculatedPercentage: [0] // Giá trị % tính từ tiền
    }, { 
      validators: [this.dateRangeValidator()] 
    });
  }

  ngOnInit(): void {
    this.loadDiscounts();
    this.loadProducts();

     // Theo dõi thay đổi sản phẩm được chọn
     this.discountForm.get('applicableProductIds')?.valueChanges.subscribe(() => {
      this.calculateTotalPrice();
    });

    // Theo dõi thay đổi loại discount
    this.discountForm.get('type')?.valueChanges.subscribe(type => {
      this.handleDiscountTypeChange(type);
    });

    // Theo dõi thay đổi giá trị
    this.discountForm.get('value')?.valueChanges.subscribe(value => {
      this.handleValueChange(value);
    });
  }

  private loadDiscounts(): void {
    this.discountService.getAll().subscribe({
      next: (discounts) => this.discounts = discounts,
      error: (err) => console.error('Error loading discounts:', err)
    });
  }

  private loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (res) => this.products = res.data,
      error: (err) => console.error('Error loading products:', err)
    });    
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.isEditMode = false;
    this.discountForm.reset({
      type: DiscountType.PERCENTAGE,
      applicableTo: ApplicableType.PRODUCT,
      isActive: true
    });
  }

  editDiscount(discount: DiscountResponse): void {
    this.isEditMode = true;
    this.selectedDiscount = discount;
    
    // Chuyển đổi ngày từ UTC sang local timezone
    const validFrom = new Date(discount.validFrom);
    const validTo = new Date(discount.validTo);
    
    this.discountForm.patchValue({
      ...discount,
      validFrom: this.toLocalDateTimeString(validFrom),
      validTo: this.toLocalDateTimeString(validTo)
    });
    
    this.openModal();
  }

  // deleteDiscount(id: number): void {
  //   if (confirm('Bạn có chắc chắn muốn xóa?')) {
  //     this.discountService.delete(id).subscribe({
  //       next: () => {
  //         this.discounts = this.discounts.filter(d => d.id !== id);
  //       },
  //       error: (err) => console.error('Error deleting discount:', err)
  //     });
  //   }
  // }

  onSubmit(): void {
    if (this.discountForm.invalid || this.isSubmitting) return;
    this.isSubmitting = true;

    const formValue = this.prepareRequestData();
    
    if (this.isEditMode) {
      this.updateDiscount(formValue);
    } else {
      this.createDiscount(formValue);
    }
  }

  onReset() {
    this.discountForm.reset();
  }

  private prepareRequestData(): DiscountRequest {
    // Chuyển đổi datetime-local → UTC+0 mà không thay đổi thời gian thực tế
    const adjustTimezone = (dateString: string) => {
      const date = new Date(dateString);
      return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
    };
  
    return {
      ...this.discountForm.value,
      validFrom: adjustTimezone(this.discountForm.value.validFrom),
      validTo: adjustTimezone(this.discountForm.value.validTo)
    };
  }

  private createDiscount(request: DiscountRequest): void {
    this.discountService.create(request).subscribe({
      next: (newDiscount) => {
        this.isSubmitting = false;
        this.discounts = [newDiscount, ...this.discounts];
        this.closeModal();
        alert('Tạo discount thành công!');
      },
      error: (err) => {
        this.isSubmitting = false;
        let errorMessage = 'Lỗi không xác định';
        
        // Xử lý thông báo lỗi từ server
        if (err.error?.error === 'Start date must be in the present or future') {
          errorMessage = 'Ngày bắt đầu phải ở hiện tại hoặc tương lai!';
        } else if (err.status === 400) {
          errorMessage = 'Dữ liệu không hợp lệ: ' + err.error.message;
        }
        
        alert(errorMessage);
      }
    });
  }

  private updateDiscount(request: DiscountRequest): void {
    this.discountService.update(this.selectedDiscount.id, request).subscribe({
      next: (updatedDiscount) => {
        const index = this.discounts.findIndex(d => d.id === updatedDiscount.id);
        if (index > -1) this.discounts[index] = updatedDiscount;
        this.closeModal();
      },
      error: (err) => console.error('Error updating discount:', err)
    });
  }

  onProductToggle(productId: number, checked: boolean): void {
    const currentIds = this.discountForm.get('applicableProductIds')?.value || [];
    const newIds = checked 
      ? [...currentIds, productId]
      : currentIds.filter((id: number) => id !== productId);
      
    this.discountForm.patchValue({ applicableProductIds: newIds });
  }

  // Helper to convert Date to local datetime string
  private toLocalDateTimeString(date: Date): string {
    const offset = date.getTimezoneOffset() * 60000; // Offset tính bằng ms
    const localDate = new Date(date.getTime() - offset);
    return localDate.toISOString().slice(0, 16);
  }

  private futureDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const selectedDate = new Date(control.value);
      const now = new Date();
      return selectedDate < now ? { pastDate: true } : null;
    };
  }

  private dateRangeValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const start = group.get('validFrom')?.value;
      const end = group.get('validTo')?.value;
      return start && end && new Date(start) >= new Date(end) 
        ? { invalidRange: true } 
        : null;
    };
  }

  private calculateTotalPrice(): void {
    const selectedProductIds = this.discountForm.get('applicableProductIds')?.value || [];
    this.totalSelectedPrice = this.products
      .filter(p => selectedProductIds.includes(p.id))
      .flatMap(p => p.productItems)
      .reduce((sum, item) => sum + item.price, 0);
      
    this.updateCalculatedValues();
  }

  private updateValidators(): void {
    const type = this.discountForm.get('type')?.value;
    const valueControl = this.discountForm.get('value');
    
    if (type === DiscountType.PERCENTAGE) {
      valueControl?.setValidators([
        Validators.required,
        Validators.min(1),
        Validators.max(90),
        this.maxPercentageValidator()
      ]);
    } else {
      valueControl?.setValidators([
        Validators.required,
        Validators.min(1),
        this.maxAmountValidator()
      ]);
    }
    valueControl?.updateValueAndValidity();
  }

  private maxPercentageValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value > 90 ? { maxPercentage: true } : null;
    };
  }

  private maxAmountValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value > this.totalSelectedPrice ? { maxAmount: true } : null;
    };
  }

  private handleDiscountTypeChange(type: DiscountType): void {
    const value = this.discountForm.get('value')?.value;
    if (this.totalSelectedPrice > 0 && value) {
      if (type === DiscountType.PERCENTAGE) {
        const percentage = (value / this.totalSelectedPrice) * 100;
        this.discountForm.patchValue({ 
          value: Math.min(percentage, 90) 
        }, { emitEvent: false });
      } else {
        const amount = (value / 100) * this.totalSelectedPrice;
        this.discountForm.patchValue({ value: amount }, { emitEvent: false });
      }
    }
    this.updateValidators();
  }

  private updateCalculatedValues(): void {
    const value = this.discountForm.get('value')?.value;
    if (value && this.totalSelectedPrice > 0) {
      const type = this.discountForm.get('type')?.value;
      if (type === DiscountType.PERCENTAGE) {
        const amount = (value / 100) * this.totalSelectedPrice;
        this.discountForm.patchValue({ _calculatedAmount: amount }, { emitEvent: false });
      } else {
        const percentage = (value / this.totalSelectedPrice) * 100;
        this.discountForm.patchValue({ _calculatedPercentage: percentage }, { emitEvent: false });
      }
    }
  }

  private handleValueChange(value: number): void {
    if (this.totalSelectedPrice > 0) {
      const type = this.discountForm.get('type')?.value;
      if (type === DiscountType.PERCENTAGE) {
        const amount = (value / 100) * this.totalSelectedPrice;
        this.discountForm.patchValue({ _calculatedAmount: amount }, { emitEvent: false });
      } else {
        const percentage = (value / this.totalSelectedPrice) * 100;
        this.discountForm.patchValue({ _calculatedPercentage: percentage }, { emitEvent: false });
      }
    }
  }
}