import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

import { WorldRankingsRoutingModule } from './world-rankings-routing.module';

import { RankingListComponent } from './ranking-list/ranking-list.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        WorldRankingsRoutingModule,
        SharedModule
    ],
    exports: [RankingListComponent],
    declarations: [RankingListComponent]
})
export class WorldRankingsModule { }
