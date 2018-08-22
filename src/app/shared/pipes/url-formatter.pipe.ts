import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'urlFormatter'
})
export class UrlFormatterPipe implements PipeTransform {

    transform(url: string): string {

        if (!/https?:\/\//.test(url)) {

            url = 'https://' + url;
        }

        return url;
    }
}
