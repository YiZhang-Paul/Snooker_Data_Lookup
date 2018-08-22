import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { PlayerDetailsRoutingModule } from './player-details-routing.module';
import { PlayerWikiComponent } from './player-wiki/player-wiki.component';
import { PlayerInformationComponent } from './player-information/player-information.component';
import { PlayerStatsComponent } from './player-stats/player-stats.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        PlayerDetailsRoutingModule
    ],
    declarations: [PlayerWikiComponent, PlayerInformationComponent, PlayerStatsComponent]
})
export class PlayerDetailsModule { }
