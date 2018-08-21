import { Component, OnInit } from '@angular/core';
import { IRankItem } from '../services/rank-item.interface';
import { LiveRankingFetcherService } from '../services/live-ranking-fetcher.service';

@Component({
    selector: 'app-ranking-list',
    templateUrl: './ranking-list.component.html',
    styleUrls: ['./ranking-list.component.css']
})
export class RankingListComponent implements OnInit {

    private _selectedYear = new Date().getFullYear();
    private _currentIndex = 0;
    private _groupSize: number;
    private _rankings: IRankItem[] = [];

    constructor(private fetcher: LiveRankingFetcherService) { }

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

    get rankings(): IRankItem[] {

        return this._rankings;
    }

    get groupIndex(): number {

        return Math.floor(this._currentIndex / this._groupSize);
    }

    get totalGroups(): number {

        return Math.ceil(this._rankings.length / this._groupSize);
    }

    get currentGroup(): IRankItem[] {

        const endIndex = this._currentIndex + this._groupSize;

        return this._rankings.slice(this._currentIndex, endIndex);
    }

    ngOnInit() {

        this.fetchRankings();
    }

    private fetchRankings(): void {

        this.fetcher.fetch(this._selectedYear).subscribe(rankings => {

            if (rankings !== null) {

                this._rankings = rankings;
                this._groupSize = this._rankings.length;
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

        this._currentIndex = 0;
        this._groupSize = Number(size);
    }
}
