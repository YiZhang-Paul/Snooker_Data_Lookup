import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { TriggerEventByCss } from '../../../../testing/custom-test-utilities';
import { IRankItem } from '../services/rank-item.interface';
import { LiveRankingFetcherService } from '../services/live-ranking-fetcher.service';
import { RankingListComponent } from './ranking-list.component';

@Component({selector: 'app-group-size-selector', template: ''})
class GroupSizeSelectorComponent {

    @Input() currentGroup: number;
    @Input() totalGroups: number;
    @Input() size: number;
    @Output() groupChange = new EventEmitter<number>();
    @Output() sizeSelect = new EventEmitter<number>();
}

describe('RankingListComponent', () => {
    let fixture: ComponentFixture<RankingListComponent>;
    let component: RankingListComponent;
    let fetcher: jasmine.SpyObj<LiveRankingFetcherService>;
    let fetchSpy: jasmine.Spy;

    const rankings: IRankItem[] = [

        { position: 1, playerId: 100, earnings: 150, type: 'MoneyRankings' },
        { position: 2, playerId: 200, earnings: 250, type: 'MoneyRankings' }
    ];

    beforeEach(() => {

        fetcher = jasmine.createSpyObj('LiveRankingFetcherService', ['fetch']);
        fetchSpy = fetcher.fetch.and.returnValue(of(rankings));

        TestBed.configureTestingModule({
            declarations: [RankingListComponent, GroupSizeSelectorComponent],
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

        expect(component.selectedYear).toEqual(new Date().getFullYear());
    });

    it('should fetch new rankings when selected year changes', () => {

        const element = fixture.debugElement;
        const payload = { target: { value: 2017 } };
        TriggerEventByCss(element, 'select', 'change', payload);

        expect(fetchSpy.calls.count()).toEqual(1);
    });

    it('fetcher should be invoked on ngOnInit', () => {

        expect(fetchSpy.calls.any()).toBe(false);

        fixture.detectChanges();

        expect(fetchSpy.calls.any()).toBe(true);
    });

    it('should have rankings when data is available', () => {

        expect(component.rankings.length).toEqual(0);

        fixture.detectChanges();

        expect(component.rankings.length).toEqual(rankings.length);
        expect(component.rankings[0].playerId).toEqual(100);
        expect(component.rankings[1].playerId).toEqual(200);
    });

    it('should display ranking table when data is available', () => {

        fixture.detectChanges();

        const rows = fixture.debugElement.queryAll(By.css('tr'));
        const columns = rows[1].queryAll(By.css('td'));
        // including table header
        expect(rows.length).toEqual(rankings.length + 1);
        expect(columns.length).toEqual(4);
        expect(columns[0].nativeElement.textContent).toEqual('1');
        expect(columns[1].nativeElement.textContent).toEqual('100');
        expect(columns[3].nativeElement.textContent).toEqual('150');
    });

    it('should have empty ranking list when data is not available', () => {

        fetchSpy = fetcher.fetch.and.returnValue(of(null));
        expect(component.rankings.length).toEqual(0);

        fixture.detectChanges();
        expect(component.rankings.length).toEqual(0);
    });

    it('should display all players when invalid group size is received', () => {

        fixture.detectChanges();
        expect(component.rankings.length).toEqual(rankings.length);

        component.onSizeSelected(-1);
        expect(component.currentGroup.length).toEqual(component.rankings.length);
        expect(component.totalGroups).toEqual(1);

        component.onSizeSelected(component.rankings.length + 1);
        expect(component.currentGroup.length).toEqual(component.rankings.length);
        expect(component.totalGroups).toEqual(1);
    });

    it('should display a group of players when valid group size is received', () => {

        fixture.detectChanges();
        expect(component.rankings.length).toEqual(rankings.length);

        component.onSizeSelected(rankings.length / 2);
        expect(component.currentGroup.length).toEqual(rankings.length / 2);
        expect(component.totalGroups).toEqual(2);
    });

    it('should move to previous/next group when possible', () => {

        fixture.detectChanges();

        component.onSizeSelected(rankings.length / 2);
        expect(component.groupIndex).toEqual(0);

        component.onGroupChanged(1);
        expect(component.groupIndex).toEqual(1);

        component.onGroupChanged(-1);
        expect(component.groupIndex).toEqual(0);
    });

    it('should stop moving to previous group upon reaching the start of list', () => {

        fixture.detectChanges();

        component.onSizeSelected(rankings.length / 2);
        expect(component.groupIndex).toEqual(0);

        component.onGroupChanged(-1);
        expect(component.groupIndex).toEqual(0);
    });

    it('should stop moving to next group upon reaching the end of list', () => {

        fixture.detectChanges();

        component.onSizeSelected(rankings.length / 2);
        expect(component.groupIndex).toEqual(0);

        component.onGroupChanged(1);
        expect(component.groupIndex).toEqual(1);

        component.onGroupChanged(1);
        expect(component.groupIndex).toEqual(1);
    });
});
