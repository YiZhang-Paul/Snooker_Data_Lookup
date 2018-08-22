import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LivePlayerFetcherService } from './players-data/live-player-fetcher.service';
import { LiveRankingFetcherService } from './rankings-data/live-ranking-fetcher.service';
import { PlayerLookupService } from './players-data/player-lookup.service';
import { RankingLookupService } from './rankings-data/ranking-lookup.service';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [],
    providers: [
        LivePlayerFetcherService,
        LiveRankingFetcherService,
        PlayerLookupService,
        RankingLookupService
    ]
})
export class DataProvidersModule { }
