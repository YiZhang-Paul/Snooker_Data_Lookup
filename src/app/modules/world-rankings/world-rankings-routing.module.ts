import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RankingListComponent } from './ranking-list/ranking-list.component';

const worldRankingRoutes: Routes = [

    { path: '', component: RankingListComponent }
];

@NgModule({
    imports: [
        RouterModule.forChild(worldRankingRoutes)
    ],
    exports: [RouterModule]
})
export class WorldRankingsRoutingModule { }
