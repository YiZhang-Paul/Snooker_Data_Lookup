import { Component, OnInit, Inject } from '@angular/core';
import { PlayerLookupService } from './modules/data-providers/players-data/player-lookup.service';
import { RankingLookupService } from './modules/data-providers/rankings-data/ranking-lookup.service';
import { APP_CONFIG } from './app-config';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    constructor(

        @Inject(APP_CONFIG) private configuration,
        private playerLookup: PlayerLookupService,
        private rankingLookup: RankingLookupService

    ) { }

    ngOnInit(): void {

        this.loadData();
    }

    private loadData(): void {

        const startYear = this.configuration.startYear;
        const currentYear = new Date().getFullYear();

        for (let i = currentYear; i >= startYear; i--) {

            this.playerLookup.getPlayers(i).subscribe();
            this.rankingLookup.getRankings(i).subscribe();
        }
    }
}
