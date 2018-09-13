import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, convertToParamMap, ParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { IRankData } from '../../data-providers/rankings-data/rank-data.interface';
import { IPlayer } from '../../data-providers/players-data/player.interface';
import { worldRankingRoutes } from '../world-rankings-routing.module';
import { RouterLinkStubDirective } from '../../../../testing/router-link-stub-directive';
import { RankingLookupService } from '../../data-providers/rankings-data/ranking-lookup.service';
import { PlayerLookupService } from '../../data-providers/players-data/player-lookup.service';
import { CountryFlagLookupService } from '../../../shared/services/country-flag-lookup.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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
    let rankingLookup: jasmine.SpyObj<RankingLookupService>;
    let getRankingsSpy: jasmine.Spy;
    let playerLookup: jasmine.SpyObj<PlayerLookupService>;
    let flagLookup: jasmine.SpyObj<CountryFlagLookupService>;
    let getFlags$Spy: jasmine.Spy;
    let routes: ActivatedRoute;
    let router: Router;
    let paramMapSpy: jasmine.Spy;
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
        setupFlagLookup();

        TestBed.configureTestingModule({

            imports: [

                RouterTestingModule.withRoutes(worldRankingRoutes),
                NoopAnimationsModule,
                MatSelectModule,
                MatPaginatorModule,
                MatTableModule,
                MatIconModule,
                MatProgressSpinnerModule
            ],
            declarations: [

                RankingListComponent,
                GroupSizeSelectorComponent,
                RouterLinkStubDirective
            ],
            providers: [

                { provide: RankingLookupService, useValue: rankingLookup },
                { provide: PlayerLookupService, useValue: playerLookup },
                { provide: CountryFlagLookupService, useValue: flagLookup }
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

        expect(component.rankings.data.length).toEqual(0);

        fixture.detectChanges();

        expect(component.rankings.data.length).toEqual(rankData.length);

        for (let i = 0; i < component.rankings.data.length; i++) {

            expect(component.rankings.data[i].name).toEqual(players[i].fullName);
        }
    });

    it('should have empty ranking list when data is not available', () => {

        getRankingsSpy.and.returnValue(of(null));
        expect(component.rankings.data.length).toEqual(0);

        fixture.detectChanges();
        expect(component.rankings.data.length).toEqual(0);
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

    function setupFlagLookup(): void {

        flagLookup = jasmine.createSpyObj('CountryFlagLookupService', ['getFlags']);
        getFlags$Spy = flagLookup.getFlags.and.returnValue(of(new Map<string, string>()));
    }

    function setupRoutesSpy(map: ParamMap): void {

        paramMapSpy = spyOnProperty(routes, 'paramMap').and.returnValue(of(map));
    }
});
