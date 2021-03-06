import { Component, OnInit, Inject } from '@angular/core';
import { Observable, fromEvent } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { IPlayer } from '../../data-providers/players-data/player.interface';
import { PlayerLookupService } from '../../data-providers/players-data/player-lookup.service';
import { PlayerFilterService } from './player-filter.service';
import { CountryFlagLookupService } from '../../../shared/services/country-flag-lookup.service';
import { APP_CONFIG } from '../../../app-config';

@Component({
    selector: 'app-player-list',
    templateUrl: './player-list.component.html',
    styleUrls: ['./player-list.component.css']
})
export class PlayerListComponent implements OnInit {

    private _year: number;
    private _nationality: string;
    private _nationalities: string[] = [];
    private _debounceTime = 150;
    private _searchResult: Observable<IPlayer[]>;
    private _sortedPlayers: IPlayer[] = [];
    private _categorizedPlayers: IPlayer[][] = [];
    private _flags: Map<string, string> = null;

    public isLoaded = false;

    constructor(

        @Inject(APP_CONFIG) private configuration,
        private playerLookup: PlayerLookupService,
        private filter: PlayerFilterService,
        private flagLookup: CountryFlagLookupService

    ) { }

    get selectedYear(): number {

        return this._year;
    }

    get selectedNationality(): string {

        return this._nationality;
    }

    get years(): number[] {

        const startYear = this.configuration.startYear;
        const currentYear = new Date().getFullYear();
        const totalYears = currentYear - startYear + 1;
        const result = new Array(totalYears).fill(0);

        return result.map((year, index) => startYear + index);
    }

    get nationalities(): string[] {

        if (this._nationalities.length === 0) {

            const result = this._sortedPlayers.map(player => player.nationality);
            this._nationalities = Array.from(new Set(result)).sort();
        }

        return this._nationalities;
    }

    get debounceTime(): number {

        return this._debounceTime;
    }

    get sortedPlayers(): IPlayer[] {

        return this._sortedPlayers;
    }

    get categorizedPlayers(): IPlayer[][] {

        return this._categorizedPlayers;
    }

    get flags(): Map<string, string> {

        return this._flags;
    }

    ngOnInit() {

        this.setupSearch();
        this._searchResult.subscribe(players => this.setPlayers(players));

        this.playerLookup.players$.subscribe(players => {

            this.setPlayers(this.toArray(players));

            if (players.size > 0) {

                this.isLoaded = true;
            }
        });

        this.flagLookup.getFlags().subscribe(flags => {

            this._flags = flags;
        });
    }

    private setPlayers(players: IPlayer[]): void {

        this._sortedPlayers = this.sortBy(players, 'firstName');
        this._categorizedPlayers = this.categorize(this._sortedPlayers);
    }

    public trackById(index: number, player: IPlayer): number {

        return player.id;
    }

    private toArray(players: Map<number, IPlayer>): IPlayer[] {

        return Array.from(players.values());
    }

    private sortBy(players: IPlayer[], property: string): IPlayer[] {

        return players.slice().sort((a, b) => {

            if (a[property] === b[property]) {

                return 0;
            }

            return a[property] < b[property] ? -1 : 1;
        });
    }

    private getLastCategory(categories: IPlayer[][]): string {

        if (categories.length === 0) {

            return null;
        }

        const player = categories[categories.length - 1][0];

        return player.firstName[0].toLowerCase();
    }

    private categorize(players: IPlayer[]): IPlayer[][] {

        const categories: IPlayer[][] = [];

        players.forEach(player => {

            const initial = this.getLastCategory(categories);

            if (!initial || initial !== player.firstName[0].toLowerCase()) {

                categories.push(new Array<IPlayer>());
            }

            categories[categories.length - 1].push(player);
        });

        return categories;
    }

    private formatTerm(term: string): string {

        return term.toLowerCase().replace(/\s/g, '');
    }

    private search(term: string): Observable<IPlayer[]> {

        return this.playerLookup.players$.pipe(

            map(players => {

                return this.filter.filterByName(this.toArray(players), term);
            })
        );
    }

    private setupSearch(): void {

        const searchBox = document.getElementById('search');

        this._searchResult = fromEvent(searchBox, 'keyup').pipe(

            map(event => (<HTMLInputElement>event.target).value),
            debounceTime(this._debounceTime),
            distinctUntilChanged(),
            switchMap(term => this.search(this.formatTerm(term)))
        );
    }

    private applyFilters(year: number, nationality: string): void {

        const players$ = year ? this.playerLookup.getPlayers(year) : this.playerLookup.players$;

        players$.subscribe(players => {

            const filterFunction = this.filter.filterByNationality;
            const result = filterFunction(this.toArray(players), nationality);
            this.setPlayers(result);
        });
    }

    public onYearSelected(year: string): void {

        this._year = year ? Number(year) : undefined;
        this.applyFilters(this._year, this._nationality);
    }

    public onNationalitySelected(nationality: string): void {

        this._nationality = nationality;
        this.applyFilters(this._year, this._nationality);
    }
}
