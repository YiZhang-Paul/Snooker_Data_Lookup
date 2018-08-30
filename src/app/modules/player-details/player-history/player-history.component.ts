import { Component, OnInit, Inject } from '@angular/core';
import { APP_CONFIG } from '../../../app-config';

@Component({
    selector: 'app-player-history',
    templateUrl: './player-history.component.html',
    styleUrls: ['./player-history.component.css']
})
export class PlayerHistoryComponent implements OnInit {

    private _currentYear = new Date().getFullYear();
    private _selectedYear: number;

    constructor(@Inject(APP_CONFIG) private configuration) { }

    get selectedYear(): number {

        return this._selectedYear;
    }

    get years(): number[] {

        const startYear = this.configuration.startYear;
        const totalYears = this._currentYear - startYear + 1;
        const result = new Array(totalYears).fill(0);

        return result.map((year, index) => startYear + index);
    }

    ngOnInit() {

        this._selectedYear = this._currentYear;
        this.loadHistory(this._selectedYear);
    }

    private loadHistory(year: number): void {


    }

    public onYearSelected(year: string): void {

        this._selectedYear = Number(year);
        this.loadHistory(this._selectedYear);
    }
}
