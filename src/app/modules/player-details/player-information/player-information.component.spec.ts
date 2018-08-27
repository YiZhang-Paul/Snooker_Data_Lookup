import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Pipe, PipeTransform } from '@angular/core';
import { of } from 'rxjs';
import { IPlayer } from '../../data-providers/players-data/player.interface';
import { queryByCss } from '../../../../testing/custom-test-utilities';
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

    let fixture: ComponentFixture<PlayerInformationComponent>;
    let component: PlayerInformationComponent;
    let routes: ActivatedRoute;
    let routesParentSpy: jasmine.Spy;
    let lookup: jasmine.SpyObj<PlayerLookupService>;

    beforeEach(async(() => {

        setupGetPlayerSpy(player.id, player);

        TestBed.configureTestingModule({

            imports: [RouterTestingModule],
            declarations: [

                PlayerInformationComponent,
                UrlFormatterPipe
            ],
            providers: [

                { provide: PlayerLookupService, useValue: lookup }
            ]

        }).compileComponents();

        routes = TestBed.get(ActivatedRoute);
        routesParentSpy = spyOnProperty(routes, 'parent');
        setupParamMapSpy({ id: player.id });
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

        setupParamMapSpy({ foo: 1 });
        fixture.detectChanges();

        expect(component.player).toBeNull();
    });

    it('should display information properly', () => {

        fixture.detectChanges();

        compareText('h2', `${player.firstName} ${player.lastName}`);
        compareText('.firstName', `First Name: ${player.firstName}`);
        compareText('.middleName', `Middle Name: ${player.middleName}`);
        compareText('.lastName', `Last Name: ${player.lastName}`);
        compareText('.gender', `Gender: ${player.sex}`);
        compareText('.birth', `Date of Birth: ${player.dateOfBirth}`);
        compareText('.country', `Country of Origin: ${player.nationality}`);
        compareText('.bio', `Bio Page: ${player.bioPage}`);
        compareText('.website', `Website: ${player.website}`);
        compareText('.twitter', `Twitter: @${player.twitter}`);
    });

    function setupParamMapSpy(map: object): void {

        const parent = new ActivatedRoute();
        routesParentSpy.and.returnValue(parent);

        const paramMap$ = of(convertToParamMap(map));
        spyOnProperty(parent, 'paramMap').and.returnValue(paramMap$);
    }

    function setupGetPlayerSpy(expectedId: number, response: IPlayer): void {

        lookup = jasmine.createSpyObj('PlayerLookupService', ['getPlayer']);

        lookup.getPlayer.and.callFake(targetId => {

            return of(targetId === expectedId ? response : null);
        });
    }

    function compareText(css: string, expected: string): void {

        const element = queryByCss(fixture.debugElement, css);
        expect(element.nativeElement.textContent).toEqual(expected);
    }
});
