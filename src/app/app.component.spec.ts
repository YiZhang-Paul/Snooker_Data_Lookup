import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { RouterLinkStubDirective } from '../testing/router-link-stub-directive';
import { RankingLookupService } from './modules/data-providers/rankings-data/ranking-lookup.service';
import { AppComponent } from './app.component';

// tslint:disable:component-selector
@Component({ selector: 'router-outlet', template: '' })
class RouterOutletStubComponent { }

describe('AppComponent', () => {

    let fixture: ComponentFixture<AppComponent>;
    let linkDebugElements: DebugElement[];
    let routerLinks: RouterLinkStubDirective[];
    let rankingLookup: jasmine.SpyObj<RankingLookupService>;
    let getRankingsSpy: jasmine.Spy;

    beforeEach(async(() => {

        rankingLookup = jasmine.createSpyObj('RankingLookupService', ['getRankings']);
        getRankingsSpy = rankingLookup.getRankings.and.returnValue(of(null));

        TestBed.configureTestingModule({
            declarations: [
                AppComponent,
                RouterLinkStubDirective,
                RouterOutletStubComponent
            ],
            providers: [
                { provide: RankingLookupService, useValue: rankingLookup }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {

        fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();

        linkDebugElements = fixture.debugElement.queryAll(By.directive(RouterLinkStubDirective));
        routerLinks = linkDebugElements.map(debugElement => debugElement.injector.get(RouterLinkStubDirective));
    });

    it('should create the app', async(() => {

        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));

    it('should bind to corresponding links', () => {

        expect(routerLinks.length).toEqual(2);
        expect(routerLinks[0].linkParams).toEqual('');
        expect(routerLinks[1].linkParams).toEqual('/rankings');
    });

    it('should navigate to binding links on click', () => {

        for (let i = 0; i < routerLinks.length; i++) {

            expect(routerLinks[i].navigatedTo).not.toEqual(routerLinks[i].linkParams);

            linkDebugElements[i].triggerEventHandler('click', null);
            fixture.detectChanges();

            expect(routerLinks[i].navigatedTo).toEqual(routerLinks[i].linkParams);
        }
    });

    it('should load rankings from all supported years on load', () => {

        const startYear = 2013;
        const endYear = new Date().getFullYear();
        const totalYears = endYear - startYear + 1;
        expect(getRankingsSpy.calls.count()).toEqual(totalYears);
    });
});
