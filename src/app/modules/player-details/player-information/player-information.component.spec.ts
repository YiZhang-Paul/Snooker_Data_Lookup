import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Pipe, PipeTransform } from '@angular/core';
import { of } from 'rxjs';
import { IPlayer } from '../../data-providers/players-data/player.interface';
import { queryByCss } from '../../../../testing/custom-test-utilities';
import { PlayerLookupService } from '../../data-providers/players-data/player-lookup.service';
import { CountryFlagLookupService } from '../../../shared/services/country-flag-lookup.service';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PlayerInformationComponent } from './player-information.component';

@Pipe({ name: 'urlFormatter' })
class UrlFormatterPipe implements PipeTransform {

    transform(url: string): string { return url; }
}

@Pipe({ name: 'urlTruncate' })
class UrlTruncatePipe implements PipeTransform {

    transform(url: string): string { return url; }
}

describe('PlayerInformationComponent', () => {

    const player = <IPlayer>{

        id: 293,
        firstName: 'John',
        middleName: 'K',
        lastName: 'Doe',
        dateOfBirth: '1999-12-12',
        sex: 'M',
        nationality: 'three-body',
        bioPage: 'bio.com',
        website: 'site.com',
        twitter: '@kDoe',
        get fullName(): string { return 'John M Doe'; }
    };


    let fixture: ComponentFixture<PlayerInformationComponent>;
    let component: PlayerInformationComponent;
    let routes: ActivatedRoute;
    let routesParentSpy: jasmine.Spy;
    let playerLookup: jasmine.SpyObj<PlayerLookupService>;
    let flagLookup: jasmine.SpyObj<CountryFlagLookupService>;
    let getFlag$Spy: jasmine.Spy;

    beforeEach(async(() => {

        setupGetPlayerSpy(player.id, player);
        setupFlagLookup();

        TestBed.configureTestingModule({

            imports: [

                RouterTestingModule,
                MatListModule,
                MatProgressSpinnerModule
            ],
            declarations: [

                PlayerInformationComponent,
                UrlFormatterPipe,
                UrlTruncatePipe
            ],
            providers: [

                { provide: PlayerLookupService, useValue: playerLookup },
                { provide: CountryFlagLookupService, useValue: flagLookup }
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

        compareText('h2', player.fullName);
        compareText('.firstName', player.firstName);
        compareText('.middleName', player.middleName);
        compareText('.lastName', player.lastName);
        compareText('.gender', 'Male');
        compareText('.birth', player.dateOfBirth);
        compareText('.country', player.nationality);
        compareText('.bio', player.bioPage);
        compareText('.website', player.website);
        compareText('.twitter', player.twitter);
    });

    function setupParamMapSpy(map: object): void {

        const parent = new ActivatedRoute();
        routesParentSpy.and.returnValue(parent);

        const paramMap$ = of(convertToParamMap(map));
        spyOnProperty(parent, 'paramMap').and.returnValue(paramMap$);
    }

    function setupGetPlayerSpy(expectedId: number, response: IPlayer): void {

        playerLookup = jasmine.createSpyObj('PlayerLookupService', ['getPlayer']);

        playerLookup.getPlayer.and.callFake(targetId => {

            return of(targetId === expectedId ? response : null);
        });
    }

    function setupFlagLookup(): void {

        flagLookup = jasmine.createSpyObj('CountryFlagLookupService', ['getFlag']);
        getFlag$Spy = flagLookup.getFlag.and.returnValue(of(''));
    }

    function compareText(css: string, expected: string): void {

        const element = queryByCss(fixture.debugElement, css);
        expect(element.nativeElement.textContent).toEqual(expected);
    }
});
