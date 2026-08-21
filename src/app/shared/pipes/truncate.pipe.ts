import { Pipe, PipeTransform } from '@angular/core';

/**
 * Custom pipe to truncate text to a specified length.
 * Usage: {{ text | truncate:50 }}
 */
@Pipe({
  name: 'truncate',
  standalone: true
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 100, trail: string = '...'): string {
    if (!value) return '';
    if (value.length <= limit) return value;
    return value.substring(0, limit).trim() + trail;
  }
}
