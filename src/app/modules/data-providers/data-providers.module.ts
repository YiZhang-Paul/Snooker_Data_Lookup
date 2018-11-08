import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LivePlayerFetcherService } from './players-data/live-player-fetcher.service';
import { LiveRankingFetcherService } from './rankings-data/live-ranking-fetcher.service';
import { CustomLivePlayerFetcherService } from './players-data/custom-live-player-fetcher.service';
import { PlayerLookupService } from './players-data/player-lookup.service';
import { CustomPlayerLookupService } from './players-data/custom-player-lookup.service';
import { RankingLookupService } from './rankings-data/ranking-lookup.service';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [],
    providers: [
        LivePlayerFetcherService,
        LiveRankingFetcherService,
        CustomLivePlayerFetcherService,
        { provide: PlayerLookupService, useClass: CustomPlayerLookupService },
        RankingLookupService
    ]
})
export class DataProvidersModule { }
