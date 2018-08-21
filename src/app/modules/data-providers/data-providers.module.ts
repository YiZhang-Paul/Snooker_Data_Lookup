import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LiveRankingFetcherService } from './rankings-data/live-ranking-fetcher.service';
import { LivePlayerFetcherService } from './players-data/live-player-fetcher.service';
import { PlayerLookupService } from './players-data/player-lookup.service';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [],
    providers: [
        LiveRankingFetcherService,
        LivePlayerFetcherService,
        PlayerLookupService
    ]
})
export class DataProvidersModule { }
