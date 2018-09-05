import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input, Output, EventEmitter, DebugElement } from '@angular/core';
import { Router, ActivatedRoute, convertToParamMap, ParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { IRankData } from '../../data-providers/rankings-data/rank-data.interface';
import { IPlayer } from '../../data-providers/players-data/player.interface';
import { worldRankingRoutes } from '../world-rankings-routing.module';
import { RouterLinkStubDirective, getLinkStubs } from '../../../../testing/router-link-stub-directive';
import { queryAllByCss, triggerEventByCss } from '../../../../testing/custom-test-utilities';
import { RankingLookupService } from '../../data-providers/rankings-data/ranking-lookup.service';
import { PlayerLookupService } from '../../data-providers/players-data/player-lookup.service';
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
    let rankingLookup: jasmine.SpyObj<RankingLookupService>;
    let getRankingsSpy: jasmine.Spy;
    let playerLookup: jasmine.SpyObj<PlayerLookupService>;
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

    const players = <IPlayer[]>[

        {
            id: 100,
            nationality: 'three-body',
            get fullName(): string { return 'Jane M Doe'; }
        },
        {
            id: 200,
            nationality: 'three-body',
            get fullName(): string { return 'John Doe'; }
        }
    ];

    beforeEach(() => {

        setupRankingLookup(rankData);
        setupPlayerLookup(players);

        TestBed.configureTestingModule({

            imports: [RouterTestingModule.withRoutes(worldRankingRoutes)],
            declarations: [

                RankingListComponent,
                GroupSizeSelectorComponent,
                RouterLinkStubDirective
            ],
            providers: [

                { provide: RankingLookupService, useValue: rankingLookup },
                { provide: PlayerLookupService, useValue: playerLookup }
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

        expect(getRankingsSpy).not.toHaveBeenCalled();

        fixture.detectChanges();

        expect(getRankingsSpy).toHaveBeenCalled();
    });

    it('should default to current year', () => {

        expect(component.activeYear).not.toEqual(currentYear);

        fixture.detectChanges();

        expect(paramMapSpy).toHaveBeenCalledTimes(1);
        expect(component.activeYear).toEqual(currentYear);
    });

    it('should have rankings when data is available', () => {

        expect(component.rankings.length).toEqual(0);

        fixture.detectChanges();

        expect(component.rankings.length).toEqual(rankData.length);

        for (let i = 0; i < component.rankings.length; i++) {

            expect(component.rankings[i].name).toEqual(players[i].fullName);
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
        compareText(columns[0], `${data.position}`);
        compareText(columns[1], player.fullName);
        compareText(columns[2], `${player.nationality}`);
        compareText(columns[3], `${data.earnings}`);
    });

    it('should setup links to player wiki pages through player names on ranking table', () => {

        fixture.detectChanges();

        [linkDebugElements, routerLinks] = getLinkStubs(fixture);
        expect(routerLinks.length).toEqual(component.rankings.length);

        for (let i = 0; i < routerLinks.length; i++) {

            const actualParameters = JSON.stringify(routerLinks[i].linkParams);
            const expectedParameters = JSON.stringify(['../../players', players[i].id]);
            expect(actualParameters).toEqual(expectedParameters);
        }
    });

    it('should have empty ranking list when data is not available', () => {

        getRankingsSpy.and.returnValue(of(null));
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

        component.onSizeChange(-1);
        expect(component.activeGroup.length).toEqual(component.rankings.length);
        expect(component.totalGroups).toEqual(1);

        component.onSizeChange(component.rankings.length + 1);
        expect(component.activeGroup.length).toEqual(component.rankings.length);
        expect(component.totalGroups).toEqual(1);
    });

    it('should display a group of players when valid group size is received', () => {

        fixture.detectChanges();
        expect(component.rankings.length).toEqual(rankData.length);

        component.onSizeChange(rankData.length / 2);
        expect(component.activeGroup.length).toEqual(rankData.length / 2);
        expect(component.totalGroups).toEqual(2);
    });

    it('should move to previous/next group when possible', () => {

        fixture.detectChanges();

        component.onSizeChange(rankData.length / 2);
        expect(component.groupIndex).toEqual(0);

        component.onGroupChange(1);
        expect(component.groupIndex).toEqual(1);

        component.onGroupChange(-1);
        expect(component.groupIndex).toEqual(0);
    });

    it('should stop moving to previous group upon reaching the start of list', () => {

        fixture.detectChanges();

        component.onSizeChange(rankData.length / 2);
        expect(component.groupIndex).toEqual(0);

        component.onGroupChange(-1);
        expect(component.groupIndex).toEqual(0);
    });

    it('should stop moving to next group upon reaching the end of list', () => {

        fixture.detectChanges();

        component.onSizeChange(rankData.length / 2);
        expect(component.groupIndex).toEqual(0);

        component.onGroupChange(1);
        expect(component.groupIndex).toEqual(1);

        component.onGroupChange(1);
        expect(component.groupIndex).toEqual(1);
    });

    function setupRankingLookup(data: IRankData[]): void {

        rankingLookup = jasmine.createSpyObj('RankingLookupService', ['getRankings']);
        getRankingsSpy = rankingLookup.getRankings.and.returnValue(of(data));
    }

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

            const ids = rankData.map(data => data.playerId);

            if (!ids.includes(targetId)) {

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

    function compareText(debugElement: DebugElement, expected: string): void {

        expect(debugElement.nativeElement.textContent).toEqual(expected);
    }
});
