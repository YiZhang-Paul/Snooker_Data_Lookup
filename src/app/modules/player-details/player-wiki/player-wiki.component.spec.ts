import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { RouterLinkStubDirective, getLinkStubs } from '../../../../testing/router-link-stub-directive';
import { PlayerWikiComponent } from './player-wiki.component';

// tslint:disable:component-selector
@Component({ selector: 'router-outlet', template: '' })
class RouterOutletStubComponent { }

describe('PlayerWikiComponent', () => {

    let fixture: ComponentFixture<PlayerWikiComponent>;
    let component: PlayerWikiComponent;
    let linkDebugElements: DebugElement[];
    let routerLinks: RouterLinkStubDirective[];

    beforeEach(async(() => {

        TestBed.configureTestingModule({

            declarations: [

                PlayerWikiComponent,
                RouterLinkStubDirective,
                RouterOutletStubComponent
            ]

        }).compileComponents();
    }));

    beforeEach(() => {

        fixture = TestBed.createComponent(PlayerWikiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        [linkDebugElements, routerLinks] = getLinkStubs(fixture);
    });

    it('should create', () => {

        expect(component).toBeTruthy();
    });

    it('should bind to corresponding links', () => {

        expect(routerLinks.length).toEqual(3);
        expect(routerLinks[0].linkParams).toEqual('details');
        expect(routerLinks[1].linkParams).toEqual('stats');
        expect(routerLinks[2].linkParams).toEqual('graphs');
    });
});
