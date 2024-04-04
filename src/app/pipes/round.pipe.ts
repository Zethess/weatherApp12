import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'round'
})
export class RoundPipe implements PipeTransform {
  transform(value: number | undefined): number|undefined {
      return value ? Math.round(value) : undefined;
  }
}
