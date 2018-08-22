import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlayerDetailsRoutingModule } from './player-details-routing.module';
import { PlayerWikiComponent } from './player-wiki/player-wiki.component';
import { PlayerInformationComponent } from './player-information/player-information.component';

@NgModule({
    imports: [
        CommonModule,
        PlayerDetailsRoutingModule
    ],
    declarations: [PlayerWikiComponent, PlayerInformationComponent]
})
export class PlayerDetailsModule { }
