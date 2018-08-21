import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LiveRankingFetcherService } from './rankings-data/live-ranking-fetcher.service';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [],
    providers: [LiveRankingFetcherService]
})
export class DataProvidersModule { }
