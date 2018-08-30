import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './layouts/home/home.component';
import { SiteComponent } from './layouts/site/site.component';

const appRoutes: Routes = [

    { path: 'home', component: HomeComponent },
    {
        path: 'site',
        component: SiteComponent,
        children: [

            { path: 'rankings', loadChildren: './modules/world-rankings/world-rankings.module#WorldRankingsModule' },
            { path: 'players', loadChildren: './modules/player-details/player-details.module#PlayerDetailsModule' },
        ]
    },
    { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
