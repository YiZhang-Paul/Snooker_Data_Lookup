import { Component, OnInit } from '@angular/core';
import { of, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { IPlayer } from '../../data-providers/players-data/player.interface';
import { IRankData } from '../../data-providers/rankings-data/rank-data.interface';
import { IRankDetail } from '../../data-providers/rankings-data/rank-detail.interface';
import { RankDetail } from '../../data-providers/rankings-data/rank-detail';
import { PlayerLookupService } from '../../data-providers/players-data/player-lookup.service';
import { LiveRankingFetcherService } from '../../data-providers/rankings-data/live-ranking-fetcher.service';

@Component({
    selector: 'app-ranking-list',
    templateUrl: './ranking-list.component.html',
    styleUrls: ['./ranking-list.component.css']
})
export class RankingListComponent implements OnInit {

    private _selectedYear = new Date().getFullYear();
    private _currentIndex = 0;
    private _groupSize: number;
    private _rankings: IRankDetail[] = [];

    constructor(

        private fetcher: LiveRankingFetcherService,
        private lookup: PlayerLookupService

    ) { }

    get selectedYear(): number {

        return this._selectedYear;
    }

    get validYears(): number[] {

        const startYear = 2013;
        const currentYear = new Date().getFullYear();
        const totalYears = currentYear - startYear + 1;
        const result = new Array(totalYears).fill(0);

        return result.map((year, index) => startYear + index);
    }

    get rankings(): IRankDetail[] {

        return this._rankings;
    }

    get groupIndex(): number {

        return Math.floor(this._currentIndex / this._groupSize);
    }

    get totalGroups(): number {

        return Math.ceil(this._rankings.length / this._groupSize);
    }

    get currentGroup(): IRankDetail[] {

        const endIndex = this._currentIndex + this._groupSize;

        return this._rankings.slice(this._currentIndex, endIndex);
    }

    ngOnInit() {

        this.fetchRankings();
    }

    private setGroupRange(size: number): void {

        this._currentIndex = 0;
        this._groupSize = size;
    }

    private getRankDetail(rankData: IRankData, player: IPlayer): IRankDetail {

        const rank = rankData.position;
        const earnings = rankData.earnings;

        if (!player) {

            return new RankDetail(rank, 'N/A', 'N/A', earnings, player);
        }

        const middleName = player.middleName ? ` ${player.middleName} ` : ' ';
        const name = `${player.firstName}${middleName}${player.lastName}`;

        return new RankDetail(rank, name, player.nationality, earnings, player);
    }

    private getRankDetails(rankData: IRankData[], players: Map<number, IPlayer>): Observable<IRankDetail[]> {

        const details = rankData.map(data => {

            const player = players.get(data.playerId);

            return this.getRankDetail(data, player);
        });

        return of(details);
    }

    private updateRankDetails(rankData: IRankData[]): void {

        this.lookup.getPlayers(this._selectedYear).pipe(

            switchMap(players => this.getRankDetails(rankData, players))

        ).subscribe(rankDetails => {

            this._rankings = rankDetails;
        });
    }

    private fetchRankings(): void {

        this.fetcher.fetch(this._selectedYear).subscribe(rankings => {

            if (rankings !== null) {

                this.setGroupRange(rankings.length);
                this.updateRankDetails(rankings);
            }
        });
    }

    public onYearSelected(year: string): void {

        this._selectedYear = Number(year);
        this.fetchRankings();
    }

    private toPreviousGroup(): void {

        const previousIndex = this._currentIndex - this._groupSize;

        if (previousIndex >= 0) {

            this._currentIndex = previousIndex;
        }
    }

    private toNextGroup(): void {

        const nextIndex = this._currentIndex + this._groupSize;

        if (nextIndex <= this._rankings.length - 1) {

            this._currentIndex = nextIndex;
        }
    }

    public onGroupChanged(direction: number): void {

        if (direction < 0) {

            this.toPreviousGroup();

            return;
        }

        this.toNextGroup();
    }

    public onSizeSelected(size: number): void {

        if (size <= 0 || size > this._rankings.length) {

            size = this._rankings.length;
        }

        this.setGroupRange(Number(size));
    }
}
