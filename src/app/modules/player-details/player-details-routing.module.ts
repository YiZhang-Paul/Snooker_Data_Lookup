import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PlayerWikiComponent } from '../player-details/player-wiki/player-wiki.component';

const playerDetailsRoutes: Routes = [

    { path: ':id', component: PlayerWikiComponent }
];

@NgModule({
    imports: [
        RouterModule.forChild(playerDetailsRoutes)
    ],
    exports: [RouterModule]
})
export class PlayerDetailsRoutingModule { }
