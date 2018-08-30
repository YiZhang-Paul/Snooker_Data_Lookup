import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PlayerCenterComponent } from './player-center/player-center.component';
import { PlayerListComponent } from './player-list/player-list.component';
import { PlayerAllStatsComponent } from './player-all-stats/player-all-stats.component';
import { PlayerWikiComponent } from '../player-details/player-wiki/player-wiki.component';
import { PlayerInformationComponent } from './player-information/player-information.component';
import { PlayerStatsComponent } from './player-stats/player-stats.component';
import { PlayerHistoryComponent } from './player-history/player-history.component';
import { PlayerGraphsComponent } from './player-graphs/player-graphs.component';

const playerDetailsRoutes: Routes = [
    {
        path: '',
        component: PlayerCenterComponent,
        children: [
            {
                path: 'allstats',
                component: PlayerAllStatsComponent
            },
            {
                path: 'list',
                component: PlayerListComponent
            },
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
                        path: 'history',
                        component: PlayerHistoryComponent
                    },
                    {
                        path: 'graphs',
                        component: PlayerGraphsComponent
                    },
                    {
                        path: '',
                        redirectTo: 'details',
                        pathMatch: 'full'
                    }
                ]
            },
            {
                path: '',
                redirectTo: 'list',
                pathMatch: 'full'
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(playerDetailsRoutes)
    ],
    exports: [RouterModule]
})
export class PlayerDetailsRoutingModule { }
