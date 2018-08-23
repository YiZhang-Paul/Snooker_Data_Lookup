import { Component, OnInit } from '@angular/core';
import { PlayerLookupService } from './modules/data-providers/players-data/player-lookup.service';
import { RankingLookupService } from './modules/data-providers/rankings-data/ranking-lookup.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    constructor(

        private playerLookup: PlayerLookupService,
        private rankingLookup: RankingLookupService

    ) { }

    ngOnInit(): void {

        this.loadData();
    }

    private loadData(): void {

        const startYear = 2013;
        const currentYear = new Date().getFullYear();

        for (let i = startYear; i <= currentYear; i++) {

            this.playerLookup.getPlayers(i).subscribe();
            this.rankingLookup.getRankings(i).subscribe();
        }
    }
}
