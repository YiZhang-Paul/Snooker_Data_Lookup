import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { PlayerDetailsRoutingModule } from './player-details-routing.module';
import { PlayerListComponent } from './player-list/player-list.component';
import { PlayerWikiComponent } from './player-wiki/player-wiki.component';
import { PlayerInformationComponent } from './player-information/player-information.component';
import { PlayerStatsComponent } from './player-stats/player-stats.component';
import { PlayerGraphsComponent } from './player-graphs/player-graphs.component';
import { PlayerCenterComponent } from './player-center/player-center.component';
import { PlayerAllStatsComponent } from './player-all-stats/player-all-stats.component';
import { PlayerHistoryComponent } from './player-history/player-history.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        PlayerDetailsRoutingModule
    ],
    declarations: [
        PlayerListComponent,
        PlayerWikiComponent,
        PlayerInformationComponent,
        PlayerStatsComponent,
        PlayerGraphsComponent,
        PlayerCenterComponent,
        PlayerAllStatsComponent,
        PlayerHistoryComponent
    ]
})
export class PlayerDetailsModule { }
