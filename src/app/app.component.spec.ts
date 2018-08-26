import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { of } from 'rxjs';
import { RouterLinkStubDirective, getLinkStubs } from '../testing/router-link-stub-directive';
import { IPlayer } from './modules/data-providers/players-data/player.interface';
import { IRankData } from './modules/data-providers/rankings-data/rank-data.interface';
import { PlayerLookupService } from './modules/data-providers/players-data/player-lookup.service';
import { RankingLookupService } from './modules/data-providers/rankings-data/ranking-lookup.service';
import { AppComponent } from './app.component';

// tslint:disable:component-selector
@Component({ selector: 'router-outlet', template: '' })
class RouterOutletStubComponent { }

describe('AppComponent', () => {

    let fixture: ComponentFixture<AppComponent>;
    let component: AppComponent;
    let linkDebugElements: DebugElement[];
    let routerLinks: RouterLinkStubDirective[];
    let playerLookup: jasmine.SpyObj<PlayerLookupService>;
    let rankingLookup: jasmine.SpyObj<RankingLookupService>;
    let getPlayersSpy: jasmine.Spy;
    let getRankingsSpy: jasmine.Spy;
    const totalYears = countYears(2013);

    beforeEach(async(() => {

        setupPlayerLookup(null);
        setupRankingLookup(null);

        TestBed.configureTestingModule({

            declarations: [

                AppComponent,
                RouterLinkStubDirective,
                RouterOutletStubComponent
            ],
            providers: [

                { provide: PlayerLookupService, useValue: playerLookup },
                { provide: RankingLookupService, useValue: rankingLookup }
            ]

        }).compileComponents();
    }));

    beforeEach(() => {

        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        [linkDebugElements, routerLinks] = getLinkStubs(fixture);
    });

    it('should create the component', async(() => {

        expect(component).toBeTruthy();
    }));

    it('should bind to corresponding links', () => {

        expect(routerLinks.length).toEqual(3);
        expect(routerLinks[0].linkParams).toEqual('');
        expect(routerLinks[1].linkParams).toEqual('/players');
        expect(routerLinks[2].linkParams).toEqual('/rankings');
    });

    it('should navigate to binding links on click', () => {

        for (let i = 0; i < routerLinks.length; i++) {

            expect(routerLinks[i].navigatedTo).not.toEqual(routerLinks[i].linkParams);

            linkDebugElements[i].triggerEventHandler('click', null);
            fixture.detectChanges();

            expect(routerLinks[i].navigatedTo).toEqual(routerLinks[i].linkParams);
        }
    });

    it('should load players from all supported years on load', () => {

        expect(getPlayersSpy).toHaveBeenCalledTimes(totalYears);
    });

    it('should load rankings from all supported years on load', () => {

        expect(getRankingsSpy).toHaveBeenCalledTimes(totalYears);
    });

    function countYears(startYear: number = 2013): number {

        return new Date().getFullYear() - startYear + 1;
    }

    function setupPlayerLookup(response: IPlayer[] = null): void {

        playerLookup = jasmine.createSpyObj('PlayerLookupService', ['getPlayers']);
        getPlayersSpy = playerLookup.getPlayers.and.returnValue(of(response));
    }

    function setupRankingLookup(response: IRankData[] = null): void {

        rankingLookup = jasmine.createSpyObj('RankingLookupService', ['getRankings']);
        getRankingsSpy = rankingLookup.getRankings.and.returnValue(of(response));
    }
});
