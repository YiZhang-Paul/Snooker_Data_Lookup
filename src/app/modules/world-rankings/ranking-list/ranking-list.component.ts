import { Component, OnInit } from '@angular/core';

import { LiveRankingFetcherService } from '../services/live-ranking-fetcher.service';

@Component({
    selector: 'app-ranking-list',
    templateUrl: './ranking-list.component.html',
    styleUrls: ['./ranking-list.component.css']
})
export class RankingListComponent implements OnInit {

    private _year = new Date().getFullYear();
    private _rankings: object[] = [];

    constructor(private fetcher: LiveRankingFetcherService) { }

    get year(): number {

        return this._year;
    }

    get rankings(): object[] {

        return this._rankings;
    }

    ngOnInit() {

        this.fetcher.fetch(this._year).subscribe(rankings => {

            if (rankings !== null) {

                this._rankings = rankings as object[];
            }
        });
    }

}
