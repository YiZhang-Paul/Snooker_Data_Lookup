import { Component, OnInit, AfterViewInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IMatchHistory } from '../../data-providers/players-data/match-history.interface';
import { PlayerMatchHistoryLookupService } from '../../data-providers/players-data/player-match-history-lookup.service';
import { APP_CONFIG } from '../../../app-config';

@Component({
    selector: 'app-player-history',
    templateUrl: './player-history.component.html',
    styleUrls: ['./player-history.component.css']
})
export class PlayerHistoryComponent implements OnInit, AfterViewInit {

    @ViewChild('message') private _message: ElementRef;
    private _id: number;
    private _currentYear = new Date().getFullYear();
    private _selectedYear: number;
    private _histories: IMatchHistory[];

    public isLoaded = false;

    constructor(

        @Inject(APP_CONFIG) private configuration,
        private routes: ActivatedRoute,
        private historyLookup: PlayerMatchHistoryLookupService

    ) { }

    get id(): number {

        return this._id;
    }

    get selectedYear(): number {

        return this._selectedYear;
    }

    get histories(): IMatchHistory[] {

        return this._histories;
    }

    get years(): number[] {

        const startYear = this.configuration.startYear;
        const totalYears = this._currentYear - startYear + 1;
        const result = new Array(totalYears).fill(0);

        return result.map((year, index) => startYear + index);
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {

        this.routes.parent.paramMap.subscribe(paramMap => {

            const timeout = setTimeout(() => {

                this._id = Number(paramMap.get('id'));
                this._selectedYear = this._currentYear;
                this.loadHistory(this._id, this._selectedYear);
                clearTimeout(timeout);
            });
        });
    }

    private hideMessage(): void {

        this._message.nativeElement.classList.add('message-invisible');
    }

    private showMessage(): void {

        this._message.nativeElement.classList.remove('message-invisible');
    }

    private setResult(histories: IMatchHistory[], year: number): void {

        if (year !== this._selectedYear) {

            return;
        }

        if (!histories || histories.length === 0) {

            this.showMessage();
        }

        this._histories = histories;
    }

    private loadHistory(id: number, year: number): void {

        this.isLoaded = false;

        this.historyLookup.getMatchHistories(id, year).subscribe(histories => {

            this.setResult(histories, year);
            this.isLoaded = true;
        });
    }

    public onYearSelected(year: string): void {

        this.hideMessage();
        this._selectedYear = Number(year);
        this._histories = null;
        this.loadHistory(this._id, this._selectedYear);
    }
}
