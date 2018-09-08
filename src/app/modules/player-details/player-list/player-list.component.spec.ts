import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DebugElement, Component } from '@angular/core';
import { of } from 'rxjs';
import { IPlayer } from '../../data-providers/players-data/player.interface';
import { RouterLinkStubDirective } from '../../../../testing/router-link-stub-directive';
import { triggerNativeEventByCss } from '../../../../testing/custom-test-utilities';
import { PlayerLookupService } from '../../data-providers/players-data/player-lookup.service';
import { PlayerFilterService } from './player-filter.service';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PlayerListComponent } from './player-list.component';

@Component({ selector: 'app-option-card', template: '' })
class TestOptionCardComponent {  }

describe('PlayerListComponent', () => {

    const players = <IPlayer[]>[

        {
            id: 293,
            firstName: 'Mike',
            nationality: 'three-body'
        },
        {
            id: 130,
            firstName: 'Jane',
            nationality: 'three-body'
        },
        {
            id: 15,
            firstName: 'Moe',
            nationality: 'china'
        }
    ];

    let fixture: ComponentFixture<PlayerListComponent>;
    let component: PlayerListComponent;
    let lookup: PlayerLookupService;
    let players$Spy: jasmine.Spy;
    let getPlayersSpy: jasmine.Spy;
    let filter: jasmine.SpyObj<PlayerFilterService>;
    const sortedPlayers = [players[1], players[0], players[2]];
    const categorizedPlayers = [[players[1]], [players[0], players[2]]];

    beforeEach(async(() => {

        setupPlayerLookup(players);
        setupPlayerFilter();

        TestBed.configureTestingModule({

            imports: [

                NoopAnimationsModule,
                MatTableModule,
                MatIconModule,
                MatSelectModule,
                MatInputModule,
                MatProgressSpinnerModule
            ],
            declarations: [

                PlayerListComponent,
                RouterLinkStubDirective,
                TestOptionCardComponent
            ],
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

    it('should sort players by first name in ascending order', () => {

        fixture.detectChanges();

        expect(component.sortedPlayers).toEqual(sortedPlayers);
    });

    it('should categorize players by the initial letter of first name', () => {

        fixture.detectChanges();

        expect(component.categorizedPlayers).toEqual(categorizedPlayers);
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

        component.onYearSelected(undefined);
        component.onNationalitySelected(undefined);

        tick();

        expect(component.sortedPlayers.length).toEqual(players.length);
    }));

    it('should properly filter players by selected year', fakeAsync(() => {

        component.onYearSelected('2015');

        tick();

        expect(component.sortedPlayers.length).toEqual(2);
        expect(getPlayersSpy).toHaveBeenCalledTimes(1);
    }));

    it('should properly filter players by selected nationality', fakeAsync(() => {

        component.onNationalitySelected('china');

        tick();

        expect(component.sortedPlayers.length).toEqual(1);
    }));

    it('should properly filter players by selected year and nationality', fakeAsync(() => {

        component.onNationalitySelected('three-body');
        component.onYearSelected('2017');

        tick();

        expect(component.sortedPlayers.length).toEqual(1);
    }));

    it('should display all players when search box is empty', fakeAsync(() => {

        fixture.detectChanges();

        const target = { value: '' };
        triggerNativeEventByCss(fixture.debugElement, '#search', 'keyup', target);
        tick(component.debounceTime);

        expect(component.sortedPlayers.length).toEqual(players.length);
    }));

    it('should properly filter players with search term', fakeAsync(() => {

        fixture.detectChanges();

        const target = { value: 'N o' };
        triggerNativeEventByCss(fixture.debugElement, '#search', 'keyup', target);
        tick(component.debounceTime);

        expect(component.sortedPlayers.length).toEqual(2);
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

            if (!pattern) {

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
