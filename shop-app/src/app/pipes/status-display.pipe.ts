// status-display.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusDisplay'
})
export class StatusDisplayPipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'ACTIVE':
        return 'Hoạt động';
      case 'SOLD_OUT':
        return 'Hết hàng';
      case 'INACTIVE':
        return 'Vô hiệu';
      default:
        return value;
    }
  }
}