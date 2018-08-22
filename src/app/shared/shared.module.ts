import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UrlFormatterPipe } from './pipes/url-formatter.pipe';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [UrlFormatterPipe],
    exports: [UrlFormatterPipe]
})
export class SharedModule { }
