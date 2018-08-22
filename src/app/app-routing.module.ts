import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [

    { path: 'rankings', loadChildren: './modules/world-rankings/world-rankings.module#WorldRankingsModule' },
    { path: 'players', loadChildren: './modules/player-details/player-details.module#PlayerDetailsModule' }
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
