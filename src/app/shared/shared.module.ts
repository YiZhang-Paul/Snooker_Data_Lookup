import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoughnutChartFactoryService } from './services/doughnut-chart-factory.service';
import { UrlFormatterPipe } from './pipes/url-formatter.pipe';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [UrlFormatterPipe],
    providers: [DoughnutChartFactoryService],
    exports: [UrlFormatterPipe]
})
export class SharedModule { }
