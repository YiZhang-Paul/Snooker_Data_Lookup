import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlayerDetailsRoutingModule } from './player-details-routing.module';
import { PlayerWikiComponent } from './player-wiki/player-wiki.component';

@NgModule({
    imports: [
        CommonModule,
        PlayerDetailsRoutingModule
    ],
    declarations: [PlayerWikiComponent]
})
export class PlayerDetailsModule { }
