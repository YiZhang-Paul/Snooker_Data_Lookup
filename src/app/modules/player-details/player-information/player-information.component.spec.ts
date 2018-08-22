import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteStub } from '../../../../testing/activated-route-stub';
import { IPlayer } from '../../data-providers/players-data/player.interface';
import { PlayerLookupService } from '../../data-providers/players-data/player-lookup.service';
import { PlayerInformationComponent } from './player-information.component';

describe('PlayerInformationComponent', () => {

    const player: IPlayer = {

        id: 293,
        firstName: '',
        middleName: '',
        lastName: '',
        shortName: 'John Doe',
        dateOfBirth: '',
        sex: '',
        nationality: 'three-body',
        photo: '',
        bioPage: '',
        website: '',
        twitter: '',
        turnedPro: 2016,
        lastSeasonPlayed: 2018
    };

    let component: PlayerInformationComponent;
    let fixture: ComponentFixture<PlayerInformationComponent>;
    let route: ActivatedRouteStub;
    let lookup: jasmine.SpyObj<PlayerLookupService>;
    const id = player.id;
    const year = 2018;

    beforeEach(async(() => {

        route = new ActivatedRouteStub();
        route.parent = new ActivatedRouteStub({ id, year });
        lookup = jasmine.createSpyObj('PlayerLookupService', ['getPlayer']);
        setupGetPlayerSpy(year, id, player);

        TestBed.configureTestingModule({
            declarations: [PlayerInformationComponent],
            providers: [
                { provide: ActivatedRoute, useValue: route },
                { provide: PlayerLookupService, useValue: lookup }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PlayerInformationComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should retrieve player object with the help of parent route parameters', () => {

        fixture.detectChanges();

        component.player$.subscribe(data => {

            expect(data).toEqual(player);
        });
    });

    it('should receive null when any parent route parameter is missing', () => {

        route.parent = new ActivatedRouteStub({ id, bar: 1 });
        fixture.detectChanges();

        component.player$.subscribe(data => {

            expect(data).toBeNull();
        });
    });

    function setupGetPlayerSpy(expectedYear: number, expectedId: number, response: IPlayer): void {

        lookup.getPlayer.and.callFake((targetYear, targetId) => {

            if (targetYear !== expectedYear || targetId !== expectedId) {

                return of(null);
            }

            return of(response);
        });
    }
});
