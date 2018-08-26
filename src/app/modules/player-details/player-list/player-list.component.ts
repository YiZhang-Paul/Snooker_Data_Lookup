import { Component, OnInit } from '@angular/core';
import { IPlayer } from '../../data-providers/players-data/player.interface';
import { PlayerLookupService } from '../../data-providers/players-data/player-lookup.service';

@Component({
    selector: 'app-player-list',
    templateUrl: './player-list.component.html',
    styleUrls: ['./player-list.component.css']
})
export class PlayerListComponent implements OnInit {

    private _year = -1;
    private _nationality = '';
    private _nationalities = [''];
    private _players: IPlayer[] = [];

    constructor(private lookup: PlayerLookupService) { }

    get selectedYear(): number {

        return this._year;
    }

    get selectedNationality(): string {

        return this._nationality;
    }

    get years(): number[] {

        const startYear = 2013;
        const currentYear = new Date().getFullYear();
        const totalYears = currentYear - startYear + 1;
        const result = new Array(totalYears + 1).fill(-1);

        return result.map((year, index) => {

            return index ? startYear + (index - 1) : -1;
        });
    }

    get nationalities(): string[] {

        if (this._nationalities.length === 1) {

            const result = this._players.map(player => player.nationality);
            this._nationalities = ['', ...Array.from(new Set(result)).sort()];
        }

        return this._nationalities;
    }

    get players(): IPlayer[] {

        return this._players;
    }

    ngOnInit() {

        this.lookup.players$.subscribe(players => {

            this._players = this.sortBy(this.toArray(players), 'id');
        });
    }

    public trackById(index: number, player: IPlayer): number {

        return player.id;
    }

    private toArray(players: Map<number, IPlayer>): IPlayer[] {

        return Array.from(players.values());
    }

    private sortBy(players: IPlayer[], property: string): IPlayer[] {

        return players.slice().sort((a, b) => a[property] - b[property]);
    }

    private filterByNationality(players: IPlayer[], nationality: string): IPlayer[] {

        if (!nationality) {

            return players;
        }

        return players.filter(player => player.nationality === nationality);
    }

    private applyFilters(year: number, nationality: string): void {

        const players$ = year === -1 ? this.lookup.players$ : this.lookup.getPlayers(year);

        players$.subscribe(players => {

            const playerList = this.toArray(players);
            const result = this.filterByNationality(playerList, nationality);
            this._players = this.sortBy(result, 'id');
        });
    }

    public onYearSelected(year: string): void {

        this._year = Number(year);
        this.applyFilters(this._year, this._nationality);
    }

    public onNationalitySelected(nationality: string): void {

        this._nationality = nationality;
        this.applyFilters(this._year, this._nationality);
    }
}
