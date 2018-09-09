import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RankingListComponent } from './ranking-list/ranking-list.component';

export const worldRankingRoutes: Routes = [

    { path: ':year', component: RankingListComponent },
    { path: '', redirectTo: '2018', pathMatch: 'full' }
];

@NgModule({
    imports: [
        RouterModule.forChild(worldRankingRoutes)
    ],
    exports: [RouterModule]
})
export class WorldRankingsRoutingModule { }
