import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
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
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { OptionCardComponent } from './components/option-card/option-card.component';
import { UrlTruncatePipe } from './pipes/url-truncate.pipe';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
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
        MatSortModule,
        MatTabsModule,
        MatInputModule,
        MatButtonToggleModule,
        MatSidenavModule,
        MatListModule
    ],
    declarations: [UrlFormatterPipe, OptionCardComponent, UrlTruncatePipe],
    providers: [DoughnutChartFactoryService],
    exports: [
        FormsModule,
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
        MatSortModule,
        MatTabsModule,
        MatInputModule,
        MatButtonToggleModule,
        MatSidenavModule,
        MatListModule,
        OptionCardComponent
    ]
})
export class SharedModule { }
