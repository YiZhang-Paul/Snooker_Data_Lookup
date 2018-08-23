import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input, Output, EventEmitter, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { TriggerEventByCss } from '../../../../testing/custom-test-utilities';
import { IRankData } from '../../data-providers/rankings-data/rank-data.interface';
import { IPlayer } from '../../data-providers/players-data/player.interface';
import { Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { worldRankingRoutes } from '../world-rankings-routing.module';
import { ActivatedRoute } from '@angular/router';
import { RouterLinkStubDirective } from '../../../../testing/router-link-stub-directive';
import { LiveRankingFetcherService } from '../../data-providers/rankings-data/live-ranking-fetcher.service';
import { PlayerLookupService } from '../../data-providers/players-data/player-lookup.service';
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
    let linkDebugElements: DebugElement[];
    let routerLinks: RouterLinkStubDirective[];
    let playerLookup: jasmine.SpyObj<PlayerLookupService>;
    let fetcher: jasmine.SpyObj<LiveRankingFetcherService>;
    let fetchSpy: jasmine.Spy;
    let routes: ActivatedRoute;
    let router: Router;
    let paramMapSpy: jasmine.Spy;
    let navigateSpy: jasmine.Spy;
    const currentYear = new Date().getFullYear();
    const paramMap = of(convertToParamMap({ year: currentYear }));

    const rankData: IRankData[] = [

        { position: 1, playerId: 100, earnings: 150, type: 'MoneyRankings' },
        { position: 2, playerId: 200, earnings: 250, type: 'MoneyRankings' }
    ];

    const players: IPlayer[] = [

        {
            id: 100,
            firstName: 'Jane',
            middleName: '',
            lastName: 'Doe',
            shortName: '',
            dateOfBirth: '',
            sex: '',
            nationality: 'three-body',
            photo: '',
            bioPage: '',
            website: '',
            twitter: '',
            turnedPro: null,
            lastSeasonPlayed: null
        },
        {
            id: 200,
            firstName: 'John',
            middleName: '',
            lastName: 'Doe',
            shortName: '',
            dateOfBirth: '',
            sex: '',
            nationality: 'three-body',
            photo: '',
            bioPage: '',
            website: '',
            twitter: '',
            turnedPro: null,
            lastSeasonPlayed: null
        }
    ];

    beforeEach(() => {

        playerLookup = jasmine.createSpyObj('PlayerLookupService', ['getPlayers', 'getPlayer']);
        playerLookup.getPlayers.and.returnValue(of(getPlayerLookupMap(players)));
        setPlayerLookupStream(players, 5);
        fetcher = jasmine.createSpyObj('LiveRankingFetcherService', ['fetch']);
        fetchSpy = fetcher.fetch.and.returnValue(of(rankData));

        TestBed.configureTestingModule({
            imports: [RouterTestingModule.withRoutes(worldRankingRoutes)],
            declarations: [
                RankingListComponent,
                GroupSizeSelectorComponent,
                RouterLinkStubDirective
            ],
            providers: [
                { provide: PlayerLookupService, useValue: playerLookup },
                { provide: LiveRankingFetcherService, useValue: fetcher }
            ]
        });

        fixture = TestBed.createComponent(RankingListComponent);
        component = fixture.componentInstance;
        routes = TestBed.get(ActivatedRoute);
        router = TestBed.get(Router);
        router.initialNavigation();
        paramMapSpy = spyOnProperty(routes, 'paramMap').and.returnValue(paramMap);
        navigateSpy = spyOn(router, 'navigate');
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('fetcher should be invoked on ngOnInit', () => {

        expect(fetchSpy.calls.any()).toBe(false);

        fixture.detectChanges();

        expect(fetchSpy.calls.any()).toBe(true);
    });

    it('should default to current year', () => {

        fixture.detectChanges();

        expect(paramMapSpy).toHaveBeenCalledTimes(1);
        expect(component.selectedYear).toEqual(currentYear);
    });

    it('should have rankings when data is available', () => {

        expect(component.rankings.length).toEqual(0);

        fixture.detectChanges();

        expect(component.rankings.length).toEqual(rankData.length);

        for (let i = 0; i < component.rankings.length; i++) {

            const expectedName = `${players[i].firstName} ${players[i].lastName}`;
            expect(component.rankings[i].name).toEqual(expectedName);
        }
    });

    it('should display ranking table when data is available', () => {

        fixture.detectChanges();

        const rows = fixture.debugElement.queryAll(By.css('tr'));
        const columns = rows[1].queryAll(By.css('td'));
        const player = players[0];
        const data = rankData[0];
        const expectedName = `${player.firstName} ${player.lastName}`;
        // including table header
        expect(rows.length).toEqual(rankData.length + 1);
        expect(columns.length).toEqual(4);
        expect(columns[0].nativeElement.textContent).toEqual(`${data.position}`);
        expect(columns[1].nativeElement.textContent).toEqual(expectedName);
        expect(columns[2].nativeElement.textContent).toEqual(player.nationality);
        expect(columns[3].nativeElement.textContent).toEqual(`${data.earnings}`);
    });

    it('should setup links to player wiki pages through player names on ranking table', () => {

        fixture.detectChanges();

        linkDebugElements = fixture.debugElement.queryAll(By.directive(RouterLinkStubDirective));
        routerLinks = linkDebugElements.map(debugElement => debugElement.injector.get(RouterLinkStubDirective));
        expect(routerLinks.length).toEqual(component.rankings.length);

        for (let i = 0; i < routerLinks.length; i++) {

            const realParameters = routerLinks[i].linkParams;
            const expectedParameters = ['../../players', players[i].id];
            expect(JSON.stringify(realParameters)).toEqual(JSON.stringify(expectedParameters));
        }
    });

    it('should have empty ranking list when data is not available', () => {

        fetchSpy = fetcher.fetch.and.returnValue(of(null));
        expect(component.rankings.length).toEqual(0);

        fixture.detectChanges();
        expect(component.rankings.length).toEqual(0);
    });

    it('should navigate to next ranking page when selected year changes', () => {

        const year = 2017;
        const element = fixture.debugElement;
        const payload = { target: { value: year } };
        TriggerEventByCss(element, 'select', 'change', payload);

        expect(navigateSpy).toHaveBeenCalledTimes(1);
        expect(navigateSpy).toHaveBeenCalledWith(['../', year], { relativeTo: routes });
    });

    it('should display all players when invalid group size is received', () => {

        fixture.detectChanges();
        expect(component.rankings.length).toEqual(rankData.length);

        component.onSizeSelected(-1);
        expect(component.currentGroup.length).toEqual(component.rankings.length);
        expect(component.totalGroups).toEqual(1);

        component.onSizeSelected(component.rankings.length + 1);
        expect(component.currentGroup.length).toEqual(component.rankings.length);
        expect(component.totalGroups).toEqual(1);
    });

    it('should display a group of players when valid group size is received', () => {

        fixture.detectChanges();
        expect(component.rankings.length).toEqual(rankData.length);

        component.onSizeSelected(rankData.length / 2);
        expect(component.currentGroup.length).toEqual(rankData.length / 2);
        expect(component.totalGroups).toEqual(2);
    });

    it('should move to previous/next group when possible', () => {

        fixture.detectChanges();

        component.onSizeSelected(rankData.length / 2);
        expect(component.groupIndex).toEqual(0);

        component.onGroupChanged(1);
        expect(component.groupIndex).toEqual(1);

        component.onGroupChanged(-1);
        expect(component.groupIndex).toEqual(0);
    });

    it('should stop moving to previous group upon reaching the start of list', () => {

        fixture.detectChanges();

        component.onSizeSelected(rankData.length / 2);
        expect(component.groupIndex).toEqual(0);

        component.onGroupChanged(-1);
        expect(component.groupIndex).toEqual(0);
    });

    it('should stop moving to next group upon reaching the end of list', () => {

        fixture.detectChanges();

        component.onSizeSelected(rankData.length / 2);
        expect(component.groupIndex).toEqual(0);

        component.onGroupChanged(1);
        expect(component.groupIndex).toEqual(1);

        component.onGroupChanged(1);
        expect(component.groupIndex).toEqual(1);
    });

    function getPlayerLookupMap(input: IPlayer[]): Map<number, IPlayer> {

        const map = new Map<number, IPlayer>();

        input.forEach(player => {

            map.set(player.id, player);
        });

        return map;
    }

    function setPlayerLookupStream(input: IPlayer[], repeat: number = 1): void {

        const stream: IPlayer[] = [];

        for (let i = 0; i < repeat; i++) {

            stream.push(...input);
        }

        playerLookup.getPlayer.and.returnValues(...stream);
    }
});
