import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PlayerListComponent } from './player-list/player-list.component';
import { PlayerWikiComponent } from '../player-details/player-wiki/player-wiki.component';
import { PlayerInformationComponent } from './player-information/player-information.component';
import { PlayerStatsComponent } from './player-stats/player-stats.component';

const playerDetailsRoutes: Routes = [
    {
        path: ':id',
        component: PlayerWikiComponent,
        children: [
            {
                path: 'details',
                component: PlayerInformationComponent
            },
            {
                path: 'stats',
                component: PlayerStatsComponent
            },
            {
                path: '',
                redirectTo: 'details',
                pathMatch: 'full'
            }
        ]
    },
    { path: '', component: PlayerListComponent }
];

@NgModule({
    imports: [
        RouterModule.forChild(playerDetailsRoutes)
    ],
    exports: [RouterModule]
})
export class PlayerDetailsRoutingModule { }
