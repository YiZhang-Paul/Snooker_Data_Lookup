import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { of } from 'rxjs';
import { IPlayer } from './modules/data-providers/players-data/player.interface';
import { IRankData } from './modules/data-providers/rankings-data/rank-data.interface';
import { PlayerLookupService } from './modules/data-providers/players-data/player-lookup.service';
import { RankingLookupService } from './modules/data-providers/rankings-data/ranking-lookup.service';
import { AppComponent } from './app.component';
import { startYear } from './app-config';

// tslint:disable:component-selector
@Component({ selector: 'router-outlet', template: '' })
class RouterOutletStubComponent { }

describe('AppComponent', () => {

    let fixture: ComponentFixture<AppComponent>;
    let component: AppComponent;
    let playerLookup: jasmine.SpyObj<PlayerLookupService>;
    let getPlayersSpy: jasmine.Spy;
    let rankingLookup: jasmine.SpyObj<RankingLookupService>;
    let getRankingsSpy: jasmine.Spy;
    const totalYears = countYears(startYear);

    beforeEach(async(() => {

        setupPlayerLookup(null);
        setupRankingLookup(null);

        TestBed.configureTestingModule({

            declarations: [

                AppComponent,
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
    });

    it('should create the component', async(() => {

        expect(component).toBeTruthy();
    }));

    it('should load players from all supported years on load', () => {

        expect(getPlayersSpy).toHaveBeenCalledTimes(totalYears);
    });

    it('should load rankings from all supported years on load', () => {

        expect(getRankingsSpy).toHaveBeenCalledTimes(totalYears);
    });

    function countYears(start: number = 2013): number {

        return new Date().getFullYear() - start + 1;
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
