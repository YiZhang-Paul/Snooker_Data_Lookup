import { Component, OnInit } from '@angular/core';
import { RankingLookupService } from './modules/data-providers/rankings-data/ranking-lookup.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    constructor(private rankingLookup: RankingLookupService) { }

    ngOnInit(): void {

        this.loadRankings();
    }

    private loadRankings(): void {

        const startYear = 2013;
        const currentYear = new Date().getFullYear();

        for (let i = startYear; i <= currentYear; i++) {

            this.rankingLookup.getRankings(i).subscribe();
        }
    }
}
