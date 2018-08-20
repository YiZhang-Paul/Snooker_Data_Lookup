import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { LiveRankingFetcherService } from '../services/live-ranking-fetcher.service';
import { RankingListComponent } from './ranking-list.component';

describe('RankingListComponent', () => {
    let fixture: ComponentFixture<RankingListComponent>;
    let component: RankingListComponent;
    let fetcher: jasmine.SpyObj<LiveRankingFetcherService>;
    let fetchSpy: jasmine.Spy;
    const rankings = [{ ID: 1, PlayerID: 1 }, { ID: 2, PlayerID: 2 }];

    beforeEach(() => {

        fetcher = jasmine.createSpyObj('LiveRankingFetcherService', ['fetch']);
        fetchSpy = fetcher.fetch.and.returnValue(of(rankings));

        TestBed.configureTestingModule({
            declarations: [RankingListComponent],
            providers: [
                { provide: LiveRankingFetcherService, useValue: fetcher }
            ]
        });

        fixture = TestBed.createComponent(RankingListComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should default to current year', () => {

        expect(component.year).toEqual(new Date().getFullYear());
    });

    it('fetcher should be invoked on ngOnInit', () => {

        expect(fetchSpy.calls.any()).toBe(false);

        fixture.detectChanges();

        expect(fetchSpy.calls.any()).toBe(true);
    });

    it('should have rankings when data is available', () => {

        expect(component.rankings.length).toEqual(0);

        fixture.detectChanges();

        expect(component.rankings.length).toEqual(2);
        expect(component.rankings[0]['ID']).toEqual(1);
        expect(component.rankings[1]['ID']).toEqual(2);
    });

    it('should display ranking table when data is available', () => {

        fixture.detectChanges();

        const rows = fixture.debugElement.queryAll(By.css('tr'));
        // including table header
        expect(rows.length).toEqual(rankings.length + 1);
    });

    it('should have empty ranking list when data is not available', () => {

        fetchSpy = fetcher.fetch.and.returnValue(of(null));

        expect(component.rankings.length).toEqual(0);

        fixture.detectChanges();

        expect(component.rankings.length).toEqual(0);
    });
});
