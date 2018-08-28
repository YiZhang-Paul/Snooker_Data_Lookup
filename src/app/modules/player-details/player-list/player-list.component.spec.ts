import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { of } from 'rxjs';
import { IPlayer } from '../../data-providers/players-data/player.interface';
import { RouterLinkStubDirective, getLinkStubs } from '../../../../testing/router-link-stub-directive';
import { queryAllByCss, triggerNativeEventByCss } from '../../../../testing/custom-test-utilities';
import { PlayerLookupService } from '../../data-providers/players-data/player-lookup.service';
import { PlayerFilterService } from './player-filter.service';
import { PlayerListComponent } from './player-list.component';

describe('PlayerListComponent', () => {

    const players: IPlayer[] = [

        {
            id: 293,
            firstName: 'John',
            middleName: 'K',
            lastName: 'Doe',
            shortName: 'John Doe',
            dateOfBirth: '1999-12-12',
            sex: 'M',
            nationality: 'three-body',
            photo: 'photo.jpg',
            bioPage: 'bio.com',
            website: 'site.com',
            twitter: '@kDoe',
            turnedPro: 2013,
            lastSeasonPlayed: 2018
        },
        {
            id: 130,
            firstName: 'Jane',
            middleName: '',
            lastName: 'Doe',
            shortName: 'Jane Doe',
            dateOfBirth: '1993-04-17',
            sex: 'F',
            nationality: 'three-body',
            photo: 'photo.jpg',
            bioPage: 'bio.com',
            website: 'site.com',
            twitter: '@NDoe',
            turnedPro: 2012,
            lastSeasonPlayed: 2018
        },
        {
            id: 15,
            firstName: 'Jim',
            middleName: '',
            lastName: 'Moe',
            shortName: 'Jim Moe',
            dateOfBirth: '1985-08-25',
            sex: 'M',
            nationality: 'china',
            photo: 'photo.jpg',
            bioPage: 'bio.com',
            website: 'site.com',
            twitter: '@Moe',
            turnedPro: 2009,
            lastSeasonPlayed: 2018
        }
    ];

    let component: PlayerListComponent;
    let fixture: ComponentFixture<PlayerListComponent>;
    let linkDebugElements: DebugElement[];
    let routerLinks: RouterLinkStubDirective[];
    let lookup: PlayerLookupService;
    let players$Spy: jasmine.Spy;
    let getPlayersSpy: jasmine.Spy;
    let filter: jasmine.SpyObj<PlayerFilterService>;
    const sortedPlayers = players.slice().sort((a, b) => a.id - b.id);

    beforeEach(async(() => {

        setupPlayerLookup(players);
        setupPlayerFilter();

        TestBed.configureTestingModule({

            declarations: [PlayerListComponent, RouterLinkStubDirective],
            providers: [

                { provide: PlayerLookupService, useValue: lookup },
                { provide: PlayerFilterService, useValue: filter }
            ]

        }).compileComponents();
    }));

    beforeEach(() => {

        fixture = TestBed.createComponent(PlayerListComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {

        expect(component).toBeTruthy();
    });

    it('should not show players when data is not available', () => {

        players$Spy.and.returnValue(of(new Map<number, IPlayer>()));

        fixture.detectChanges();

        routerLinks = getLinkStubs(fixture)[1];
        expect(routerLinks.length).toEqual(0);
    });

    it('should display all players when data is available', () => {

        fixture.detectChanges();

        routerLinks = getLinkStubs(fixture)[1];
        expect(routerLinks.length).toEqual(players.length);
    });

    it('should sort players by id in ascending order', () => {

        fixture.detectChanges();

        expect(component.players).toEqual(sortedPlayers);
    });

    it('should bind to corresponding links for player wiki pages', () => {

        fixture.detectChanges();

        routerLinks = getLinkStubs(fixture)[1];
        expect(routerLinks.length).toEqual(players.length);

        for (let i = 0; i < routerLinks.length; i++) {

            expect(routerLinks[i].linkParams).toEqual(`../${sortedPlayers[i].id}`);
        }
    });

    it('should navigate to binding links on click', () => {

        fixture.detectChanges();

        [linkDebugElements, routerLinks] = getLinkStubs(fixture);

        for (let i = 0; i < routerLinks.length; i++) {

            expect(routerLinks[i].navigatedTo).not.toEqual(routerLinks[i].linkParams);

            linkDebugElements[i].triggerEventHandler('click', null);
            fixture.detectChanges();

            expect(routerLinks[i].navigatedTo).toEqual(routerLinks[i].linkParams);
        }
    });

    it('should populate year options', () => {

        fixture.detectChanges();

        const options = queryAllByCss(fixture.debugElement, '.years option');
        const totalYears = new Date().getFullYear() - 2013 + 1;

        expect(options.length).toEqual(totalYears + 1);
        compareText(options[0], 'All');

        for (let i = 1; i < options.length; i++) {

            compareText(options[i], `${2013 + (i - 1)}`);
        }
    });

    it('should populate nationality options', () => {

        fixture.detectChanges();

        const options = queryAllByCss(fixture.debugElement, '.nationalities option');

        expect(options.length).toEqual(3);
        compareText(options[0], 'All');
        // nationalities will be sorted in ascending order
        compareText(options[1], players[2].nationality);
        compareText(options[2], players[0].nationality);
    });

    it('should update selected year', () => {

        component.onYearSelected('2017');

        expect(component.selectedYear).toEqual(2017);
    });

    it('should update selected nationality', () => {

        component.onNationalitySelected('three-body');

        expect(component.selectedNationality).toEqual('three-body');
    });

    it('should show all players when year and nationality are set to "All"', fakeAsync(() => {

        component.onYearSelected('-1');
        component.onNationalitySelected('');

        tick();

        expect(component.players.length).toEqual(players.length);
    }));

    it('should properly filter players by selected year', fakeAsync(() => {

        component.onYearSelected('2017');

        tick();

        expect(component.players.length).toEqual(2);
    }));

    it('should properly filter players by selected nationality', fakeAsync(() => {

        component.onNationalitySelected('china');

        tick();

        expect(component.players.length).toEqual(1);
    }));

    it('should properly filter players by selected year and nationality', fakeAsync(() => {

        component.onNationalitySelected('three-body');
        component.onYearSelected('2017');

        tick();

        expect(component.players.length).toEqual(1);
    }));

    it('should display all players when search box is empty', fakeAsync(() => {

        fixture.detectChanges();

        const target = { value: '' };
        triggerNativeEventByCss(fixture.debugElement, '#search', 'keyup', target);
        tick(component.debounceTime);

        expect(component.players.length).toEqual(players.length);
    }));

    it('should properly filter players with search term', fakeAsync(() => {

        fixture.detectChanges();

        const target = { value: 'N o' };
        triggerNativeEventByCss(fixture.debugElement, '#search', 'keyup', target);
        tick(component.debounceTime);

        expect(component.players.length).toEqual(2);
    }));

    function compareText(debugElement: DebugElement, expected: string): void {

        expect(debugElement.nativeElement.textContent).toEqual(expected);
    }

    function toMap(data: IPlayer[]): Map<number, IPlayer> {

        const map = new Map<number, IPlayer>();

        data.forEach(player => {

            map.set(player.id, player);
        });

        return map;
    }

    function setupPlayerLookup(data: IPlayer[]): void {

        lookup = new PlayerLookupService(null);
        players$Spy = spyOnProperty(lookup, 'players$');
        getPlayersSpy = spyOn(lookup, 'getPlayers');
        players$Spy.and.returnValue(of(toMap(data)));
        getPlayersSpy.and.returnValue(of(toMap(data.slice(1))));
    }

    function setupPlayerFilter(): void {

        filter = jasmine.createSpyObj('PlayerFilterService', ['filterByName', 'filterByNationality']);

        filter.filterByName.and.callFake((input: IPlayer[], pattern: string) => {

            if (pattern === '') {

                return input;
            }

            return pattern === 'no' ? input.slice(0, 2) : input.slice(2);
        });

        filter.filterByNationality.and.callFake((input: IPlayer[], pattern: string) => {

            if (pattern === '') {

                return input;
            }

            return input.filter(player => {

                return pattern === 'china' ?
                    player.nationality === 'china' :
                    player.nationality !== 'china';
            });
        });
    }
});
