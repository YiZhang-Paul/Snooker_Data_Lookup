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
    private _careerEarning: number;
    private _currentRank: number;
    private _highestRank: number;
    private _lowestRank: number;

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

    get careerEarning(): number {

        return this._careerEarning;
    }

    get currentRank(): number {

        return this._currentRank;
    }

    get highestRank(): number {

        return this._highestRank;
    }

    get lowestRank(): number {

        return this._lowestRank;
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

            this.statistics.getTotalEarning(id),
            this.statistics.getCurrentRank(id),
            this.statistics.getHighestRank(id),
            this.statistics.getLowestRank(id)

        ]).subscribe(results => {

            this._careerEarning = results[0];
            this._currentRank = results[1];
            this._highestRank = results[2];
            this._lowestRank = results[3];
        });
    }
}
