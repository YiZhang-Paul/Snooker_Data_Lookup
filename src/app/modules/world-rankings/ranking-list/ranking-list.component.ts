import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { map } from 'rxjs/operators';
import { IPlayer } from '../../data-providers/players-data/player.interface';
import { IRankData } from '../../data-providers/rankings-data/rank-data.interface';
import { IRankDetail } from '../../data-providers/rankings-data/rank-detail.interface';
import { RankDetail } from '../../data-providers/rankings-data/rank-detail';
import { RankingLookupService } from '../../data-providers/rankings-data/ranking-lookup.service';
import { PlayerLookupService } from '../../data-providers/players-data/player-lookup.service';
import { APP_CONFIG } from '../../../app-config';

@Component({
    selector: 'app-ranking-list',
    templateUrl: './ranking-list.component.html',
    styleUrls: ['./ranking-list.component.css']
})
export class RankingListComponent implements OnInit {

    private _activeYear: number;
    private _headings = ['rank', 'name', 'nationality', 'earnings'];
    private _rankings = new MatTableDataSource(<IRankDetail[]>[]);
    public canSelect = false;
    public isLoaded = false;

    @ViewChild(MatSort) matSort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(

        @Inject(APP_CONFIG) private configuration,
        private routes: ActivatedRoute,
        private router: Router,
        private rankingLookup: RankingLookupService,
        private playerLookup: PlayerLookupService

    ) { }

    get activeYear(): number {

        return this._activeYear;
    }

    get years(): number[] {

        const startYear = this.configuration.startYear;
        const currentYear = new Date().getFullYear();
        const totalYears = currentYear - startYear + 1;
        const result = new Array(totalYears).fill(0);

        return result.map((year, index) => startYear + index);
    }

    get shortHeadings(): string[] {

        return this._headings.slice(0, 2);
    }

    get headings(): string[] {

        return this._headings;
    }

    get rankings(): MatTableDataSource<IRankDetail> {

        return this._rankings;
    }

    ngOnInit(): void {

        this.routes.paramMap.subscribe(paramMap => {

            this._activeYear = Number(paramMap.get('year'));
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

    private setPaginator(total: number): void {

        this.paginator.pageIndex = 0;
        this.paginator.length = total;
        this.paginator.pageSize = total;
        this.paginator.pageSizeOptions = [5, 10, 25, 50, 100, total];
    }

    private setRankDetails(rankData: IRankData[]): void {

        this.playerLookup.getPlayers(this._activeYear).pipe(

            map(players => this.getRankDetails(rankData, players))

        ).subscribe(rankDetails => {

            this.setPaginator(rankDetails.length);
            this._rankings = new MatTableDataSource(rankDetails);
            this._rankings.paginator = this.paginator;
            this._rankings.sort = this.matSort;
            this.canSelect = true;
            this.isLoaded = true;
        });
    }

    private fetchRankings(): void {

        this.isLoaded = false;

        this.rankingLookup.getRankings(this._activeYear).subscribe(rankings => {

            if (rankings !== null) {

                this.setRankDetails(rankings);
            }
        });
    }

    public onYearChange(year: string): void {

        const parameters = ['../', year];
        const relativeTo = this.routes;

        this.router.navigate(parameters, { relativeTo });
    }
}
