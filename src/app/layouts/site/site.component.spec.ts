import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { RouterLinkStubDirective, getLinkStubs } from '../../../testing/router-link-stub-directive';
import { SiteComponent } from './site.component';

// tslint:disable:component-selector
@Component({ selector: 'router-outlet', template: '' })
class RouterOutletStubComponent { }

describe('SiteComponent', () => {

    let fixture: ComponentFixture<SiteComponent>;
    let component: SiteComponent;
    let linkDebugElements: DebugElement[];
    let routerLinks: RouterLinkStubDirective[];

    beforeEach(async(() => {

        TestBed.configureTestingModule({

            declarations: [

                SiteComponent,
                RouterOutletStubComponent,
                RouterLinkStubDirective
            ]

        }).compileComponents();
    }));

    beforeEach(() => {

        fixture = TestBed.createComponent(SiteComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        [linkDebugElements, routerLinks] = getLinkStubs(fixture);
    });

    it('should create', () => {

        expect(component).toBeTruthy();
    });

    it('should bind to corresponding links', () => {

        expect(routerLinks.length).toEqual(3);
        expect(routerLinks[0].linkParams).toEqual('');
        expect(routerLinks[1].linkParams).toEqual('/site/players');
        expect(routerLinks[2].linkParams).toEqual('/site/rankings');
    });

    it('should navigate to binding links on click', () => {

        for (let i = 0; i < routerLinks.length; i++) {

            expect(routerLinks[i].navigatedTo).not.toEqual(routerLinks[i].linkParams);

            linkDebugElements[i].triggerEventHandler('click', null);
            fixture.detectChanges();

            expect(routerLinks[i].navigatedTo).toEqual(routerLinks[i].linkParams);
        }
    });
});
