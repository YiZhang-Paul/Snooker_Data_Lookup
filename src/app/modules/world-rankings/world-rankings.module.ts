import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorldRankingsRoutingModule } from './world-rankings-routing.module';

import { RankingListComponent } from './ranking-list/ranking-list.component';

@NgModule({
    imports: [
        CommonModule,
        WorldRankingsRoutingModule
    ],
    exports: [RankingListComponent],
    declarations: [RankingListComponent]
})
export class WorldRankingsModule { }
