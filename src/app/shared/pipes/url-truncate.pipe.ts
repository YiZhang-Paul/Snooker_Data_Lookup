import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'urlTruncate'
})
export class UrlTruncatePipe implements PipeTransform {

    transform(value: string): any {

        return value.replace(/^.*:\/*/, '').replace(/\/.*/, '');
    }
}
