import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, DebugElement } from '@angular/core';
import { RouterLinkStubDirective } from '../../../../testing/router-link-stub-directive';
import { PlayerWikiComponent } from './player-wiki.component';

// tslint:disable:component-selector
@Component({ selector: 'router-outlet', template: '' })
class RouterOutletStubComponent { }

describe('PlayerWikiComponent', () => {
    let component: PlayerWikiComponent;
    let fixture: ComponentFixture<PlayerWikiComponent>;
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

        linkDebugElements = fixture.debugElement.queryAll(By.directive(RouterLinkStubDirective));
        routerLinks = linkDebugElements.map(debugElement => debugElement.injector.get(RouterLinkStubDirective));
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should bind to corresponding links', () => {

        expect(routerLinks.length).toEqual(2);
        expect(routerLinks[0].linkParams).toEqual('details');
        expect(routerLinks[1].linkParams).toEqual('stats');
    });
});
