import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { WorldRankingsRoutingModule } from './world-rankings-routing.module';

import { RankingListComponent } from './ranking-list/ranking-list.component';
import { GroupSizeSelectorComponent } from './group-size-selector/group-size-selector.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        WorldRankingsRoutingModule
    ],
    exports: [RankingListComponent],
    declarations: [RankingListComponent, GroupSizeSelectorComponent]
})
export class WorldRankingsModule { }
