import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchTerm: string, fields: string[]): any[] {
    if (!items || !searchTerm || !fields) return items;

    return items.filter(item => {
      return fields.some(field => {
        const value = item[field]?.toString().toLowerCase();
        return value?.includes(searchTerm.toLowerCase());
      });
    });
  }
}