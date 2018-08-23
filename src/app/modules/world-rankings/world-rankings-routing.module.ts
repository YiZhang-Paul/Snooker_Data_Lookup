import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RankingListComponent } from './ranking-list/ranking-list.component';

const currentYear = new Date().getFullYear();

export const worldRankingRoutes: Routes = [

    { path: ':year', component: RankingListComponent },
    { path: '', redirectTo: `${currentYear}`, pathMatch: 'full' }
];

@NgModule({
    imports: [
        RouterModule.forChild(worldRankingRoutes)
    ],
    exports: [RouterModule]
})
export class WorldRankingsRoutingModule { }
