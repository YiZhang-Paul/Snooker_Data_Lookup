import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { Pipe, PipeTransform } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteStub } from '../../../../testing/activated-route-stub';
import { IPlayer } from '../../data-providers/players-data/player.interface';
import { PlayerLookupService } from '../../data-providers/players-data/player-lookup.service';
import { PlayerInformationComponent } from './player-information.component';

@Pipe({ name: 'urlFormatter' })
class UrlFormatterPipe implements PipeTransform {

    transform(url: string): string { return ''; }
}

describe('PlayerInformationComponent', () => {

    const player: IPlayer = {

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
    };

    let component: PlayerInformationComponent;
    let fixture: ComponentFixture<PlayerInformationComponent>;
    let route: ActivatedRouteStub;
    let lookup: jasmine.SpyObj<PlayerLookupService>;
    const id = player.id;

    beforeEach(async(() => {

        route = new ActivatedRouteStub();
        route.parent = new ActivatedRouteStub({ id });
        lookup = jasmine.createSpyObj('PlayerLookupService', ['getPlayer']);
        setupGetPlayerSpy(id, player);

        TestBed.configureTestingModule({
            declarations: [PlayerInformationComponent, UrlFormatterPipe],
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

        expect(component.player).toEqual(player);
    });

    it('should receive null when any parent route parameter is missing', () => {

        route.parent = new ActivatedRouteStub({ bar: 1 });
        fixture.detectChanges();

        expect(component.player).toBeNull();
    });

    it('should display information properly', () => {

        fixture.detectChanges();

        checkTextContent('h2', `${player.firstName} ${player.lastName}`);
        checkTextContent('.firstName', `First Name: ${player.firstName}`);
        checkTextContent('.middleName', `Middle Name: ${player.middleName}`);
        checkTextContent('.lastName', `Last Name: ${player.lastName}`);
        checkTextContent('.gender', `Gender: ${player.sex}`);
        checkTextContent('.birth', `Date of Birth: ${player.dateOfBirth}`);
        checkTextContent('.country', `Country of Origin: ${player.nationality}`);
        checkTextContent('.bio', `Bio Page: ${player.bioPage}`);
        checkTextContent('.website', `Website: ${player.website}`);
        checkTextContent('.twitter', `Twitter: @${player.twitter}`);
        checkTextContent('.turnedPro', `Year Turned Pro: ${player.turnedPro}`);
        checkTextContent('.lastSeason', `Last Season Played: ${player.lastSeasonPlayed}`);
    });

    function checkTextContent(css: string, expected: string): void {

        const element = fixture.debugElement.query(By.css(css));
        const textContent = element.nativeElement.textContent;
        expect(textContent).toEqual(expected);
    }

    function setupGetPlayerSpy(expectedId: number, response: IPlayer): void {

        lookup.getPlayer.and.callFake(targetId => {

            return of(targetId === expectedId ? response : null);
        });
    }
});
