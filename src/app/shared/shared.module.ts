import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoughnutChartFactoryService } from './services/doughnut-chart-factory.service';
import { UrlFormatterPipe } from './pipes/url-formatter.pipe';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';

@NgModule({
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        MatToolbarModule,
        MatGridListModule,
        MatDividerModule,
        MatCardModule,
        MatSelectModule,
        MatPaginatorModule,
        MatTableModule,
        MatSortModule
    ],
    declarations: [UrlFormatterPipe],
    providers: [DoughnutChartFactoryService],
    exports: [
        UrlFormatterPipe,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        MatToolbarModule,
        MatGridListModule,
        MatDividerModule,
        MatCardModule,
        MatSelectModule,
        MatPaginatorModule,
        MatTableModule,
        MatSortModule
    ]
})
export class SharedModule { }
