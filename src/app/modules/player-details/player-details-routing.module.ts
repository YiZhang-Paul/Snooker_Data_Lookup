import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PlayerWikiComponent } from '../player-details/player-wiki/player-wiki.component';
import { PlayerInformationComponent } from './player-information/player-information.component';

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
                path: '',
                redirectTo: 'details',
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
