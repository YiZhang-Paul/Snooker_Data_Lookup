import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { of } from 'rxjs';
import { IPlayer } from '../../data-providers/players-data/player.interface';
import { RouterLinkStubDirective, getLinkStubs } from '../../../../testing/router-link-stub-directive';
import { PlayerLookupService } from '../../data-providers/players-data/player-lookup.service';
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
            turnedPro: 2016,
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
            turnedPro: 2017,
            lastSeasonPlayed: 2018
        }
    ];

    let component: PlayerListComponent;
    let fixture: ComponentFixture<PlayerListComponent>;
    let linkDebugElements: DebugElement[];
    let routerLinks: RouterLinkStubDirective[];
    let lookup: PlayerLookupService;
    let players$Spy: jasmine.Spy;
    const sortedPlayers = players.sort((a, b) => a.id - b.id);

    beforeEach(async(() => {

        setupPlayerLookup(players);

        TestBed.configureTestingModule({

            declarations: [PlayerListComponent, RouterLinkStubDirective],
            providers: [{ provide: PlayerLookupService, useValue: lookup }]

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

    it('should retrieve list of all players when data is available', () => {

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

            expect(routerLinks[i].linkParams).toEqual(`${sortedPlayers[i].id}`);
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
        players$Spy.and.returnValue(of(toMap(data)));
    }
});
