import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input, Output, EventEmitter, DebugElement } from '@angular/core';
import { Router, ActivatedRoute, convertToParamMap, ParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { IRankData } from '../../data-providers/rankings-data/rank-data.interface';
import { IPlayer } from '../../data-providers/players-data/player.interface';
import { worldRankingRoutes } from '../world-rankings-routing.module';
import { RouterLinkStubDirective, getLinkStubs } from '../../../../testing/router-link-stub-directive';
import { compareTextContent, queryAllByCss, triggerEventByCss } from '../../../../testing/custom-test-utilities';
import { PlayerLookupService } from '../../data-providers/players-data/player-lookup.service';
import { LiveRankingFetcherService } from '../../data-providers/rankings-data/live-ranking-fetcher.service';
import { RankingListComponent } from './ranking-list.component';

@Component({ selector: 'app-group-size-selector', template: '' })
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
    const paramMap = convertToParamMap({ year: currentYear });

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

        setupPlayerLookup(players);
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
        setupRoutesSpy(paramMap);
    });

    it('should create', () => {

        expect(component).toBeTruthy();
    });

    it('fetcher should be invoked on ngOnInit', () => {

        expect(fetchSpy).not.toHaveBeenCalled();

        fixture.detectChanges();

        expect(fetchSpy).toHaveBeenCalled();
    });

    it('should default to current year', () => {

        expect(component.selectedYear).not.toEqual(currentYear);

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

        const rows = queryAllByCss(fixture.debugElement, 'tr');
        const columns = queryAllByCss(rows[1], 'td');
        // including table header
        expect(rows.length).toEqual(rankData.length + 1);
        expect(columns.length).toEqual(4);

        const player = players[0];
        const data = rankData[0];
        compareTextContent(columns[0], `${data.position}`);
        compareTextContent(columns[1], `${player.firstName} ${player.lastName}`);
        compareTextContent(columns[2], `${player.nationality}`);
        compareTextContent(columns[3], `${data.earnings}`);
    });

    it('should setup links to player wiki pages through player names on ranking table', () => {

        fixture.detectChanges();

        [linkDebugElements, routerLinks] = getLinkStubs(fixture);
        expect(routerLinks.length).toEqual(component.rankings.length);

        for (let i = 0; i < routerLinks.length; i++) {

            const actualParameters = JSON.stringify(routerLinks[i].linkParams);
            const expectedParameters = ['../../players', players[i].id];
            expect(actualParameters).toEqual(JSON.stringify(expectedParameters));
        }
    });

    it('should have empty ranking list when data is not available', () => {

        fetchSpy = fetcher.fetch.and.returnValue(of(null));
        expect(component.rankings.length).toEqual(0);

        fixture.detectChanges();
        expect(component.rankings.length).toEqual(0);
    });

    it('should navigate to next ranking page when selected year changes', () => {

        const payload = { target: { value: currentYear } };
        triggerEventByCss(fixture.debugElement, 'select', 'change', payload);

        expect(navigateSpy).toHaveBeenCalledTimes(1);
        expect(navigateSpy).toHaveBeenCalledWith(['../', currentYear], { relativeTo: routes });
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

    function setupPlayerLookup(input: IPlayer[]): void {

        playerLookup = jasmine.createSpyObj('PlayerLookupService', ['getPlayers', 'getPlayer']);

        playerLookup.getPlayer.and.callFake(targetId => {

            if (!new Set(rankData.map(data => data.playerId)).has(targetId)) {

                return of(null);
            }

            return of(players[targetId === rankData[0].playerId ? 0 : 1]);
        });

        playerLookup.getPlayers.and.returnValue(of(getPlayerLookupMap(input)));
    }

    function setupRoutesSpy(map: ParamMap): void {

        paramMapSpy = spyOnProperty(routes, 'paramMap').and.returnValue(of(map));
        navigateSpy = spyOn(router, 'navigate');
    }
});
