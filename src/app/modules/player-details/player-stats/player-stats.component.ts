import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { IPlayer } from '../../data-providers/players-data/player.interface';
import { PlayerStatisticsCalculatorService } from '../../data-providers/players-data/player-statistics-calculator.service';
import { PlayerLookupService } from '../../data-providers/players-data/player-lookup.service';

@Component({
    selector: 'app-player-stats',
    templateUrl: './player-stats.component.html',
    styleUrls: ['./player-stats.component.css']
})
export class PlayerStatsComponent implements OnInit {

    private _player: IPlayer = null;
    private _careerEarnings: number;
    private _currentRanking: number;
    private _highestRanking: number;
    private _lowestRanking: number;

    constructor(

        private routes: ActivatedRoute,
        private lookup: PlayerLookupService,
        private statistics: PlayerStatisticsCalculatorService

    ) { }

    get player(): IPlayer {

        return this._player;
    }

    get status(): string {

        if (!this._player) {

            return '';
        }

        const currentYear = new Date().getFullYear();
        const isActive = this._player.lastSeasonPlayed === currentYear;

        return isActive ? 'Active' : 'Currently Retired';
    }

    get careerEarnings(): number {

        return this._careerEarnings;
    }

    get currentRanking(): number {

        return this._currentRanking;
    }

    get highestRanking(): number {

        return this._highestRanking;
    }

    get lowestRanking(): number {

        return this._lowestRanking;
    }

    ngOnInit() {

        this.routes.parent.paramMap.subscribe(params => {

            const id = Number(params.get('id'));

            this.lookup.getPlayer(id).subscribe(player => {

                this._player = player;
                this.setStatistics(id);
            });
        });
    }

    private setStatistics(id: number): void {

        forkJoin([

            this.statistics.getTotalEarnings(id),
            this.statistics.getCurrentRanking(id),
            this.statistics.getHighestRanking(id),
            this.statistics.getLowestRanking(id)

        ]).subscribe(results => {

            this._careerEarnings = results[0];
            this._currentRanking = results[1];
            this._highestRanking = results[2];
            this._lowestRanking = results[3];
        });
    }
}
