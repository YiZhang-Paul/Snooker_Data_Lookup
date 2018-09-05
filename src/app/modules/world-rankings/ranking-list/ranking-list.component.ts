import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { IPlayer } from '../../data-providers/players-data/player.interface';
import { IRankData } from '../../data-providers/rankings-data/rank-data.interface';
import { IRankDetail } from '../../data-providers/rankings-data/rank-detail.interface';
import { RankDetail } from '../../data-providers/rankings-data/rank-detail';
import { RankingLookupService } from '../../data-providers/rankings-data/ranking-lookup.service';
import { PlayerLookupService } from '../../data-providers/players-data/player-lookup.service';

@Component({
    selector: 'app-ranking-list',
    templateUrl: './ranking-list.component.html',
    styleUrls: ['./ranking-list.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class RankingListComponent implements OnInit {

    private _activeYear: number;
    private _pointer = 0;
    private _groupSize: number;
    private _headings = ['rank', 'player', 'nationality', 'winnings'];
    private _rankings: IRankDetail[] = [];

    constructor(

        private activatedRoute: ActivatedRoute,
        private router: Router,
        private rankingLookup: RankingLookupService,
        private playerLookup: PlayerLookupService

    ) { }

    get activeYear(): number {

        return this._activeYear;
    }

    get years(): number[] {

        const startYear = 2013;
        const currentYear = new Date().getFullYear();
        const totalYears = currentYear - startYear + 1;
        const result = new Array(totalYears).fill(0);

        return result.map((year, index) => startYear + index);
    }

    get headings(): string[] {

        return this._headings;
    }

    get rankings(): IRankDetail[] {

        return this._rankings;
    }

    get groupIndex(): number {

        return Math.floor(this._pointer / this._groupSize);
    }

    get totalGroups(): number {

        return Math.ceil(this._rankings.length / this._groupSize);
    }

    get activeGroup(): IRankDetail[] {

        const endIndex = this._pointer + this._groupSize;

        return this._rankings.slice(this._pointer, endIndex);
    }

    ngOnInit() {

        this.activatedRoute.paramMap.subscribe(params => {

            this._activeYear = Number(params.get('year'));
            this.fetchRankings();
        });
    }

    private getRankDetail(rankData: IRankData, player: IPlayer): IRankDetail {

        const rank = rankData.position;
        const earnings = rankData.earnings;

        if (!player) {

            return new RankDetail(rank, 'N/A', 'N/A', earnings, player);
        }

        return new RankDetail(rank, player.fullName, player.nationality, earnings, player);
    }

    private getRankDetails(rankData: IRankData[], players: Map<number, IPlayer>): IRankDetail[] {

        const details = rankData.map(data => {

            const player = players.get(data.playerId);

            return this.getRankDetail(data, player);
        });

        return details;
    }

    private updateRankDetails(rankData: IRankData[]): void {

        this.playerLookup.getPlayers(this._activeYear).pipe(

            map(players => this.getRankDetails(rankData, players))

        ).subscribe(rankDetails => {

            this._rankings = rankDetails;
        });
    }

    private setGroupRange(size: number): void {

        this._pointer = 0;
        this._groupSize = size;
    }

    private fetchRankings(): void {

        this.rankingLookup.getRankings(this._activeYear).subscribe(rankings => {

            if (rankings !== null) {

                this.setGroupRange(rankings.length);
                this.updateRankDetails(rankings);
            }
        });
    }

    public onYearChange(year: string): void {

        const parameters = ['../', year];
        const relativeTo = this.activatedRoute;

        this.router.navigate(parameters, { relativeTo });
    }

    private toPreviousGroup(): void {

        const previousIndex = this._pointer - this._groupSize;

        if (previousIndex >= 0) {

            this._pointer = previousIndex;
        }
    }

    private toNextGroup(): void {

        const nextIndex = this._pointer + this._groupSize;

        if (nextIndex <= this._rankings.length - 1) {

            this._pointer = nextIndex;
        }
    }

    public onGroupChange(direction: number): void {

        if (direction < 0) {

            this.toPreviousGroup();

            return;
        }

        this.toNextGroup();
    }

    public onSizeChange(size: number): void {

        if (size <= 0 || size > this._rankings.length) {

            size = this._rankings.length;
        }

        this.setGroupRange(Number(size));
    }
}
