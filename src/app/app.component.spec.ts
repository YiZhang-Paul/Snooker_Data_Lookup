import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RouterLinkDirectiveStub } from '../testing/router-link-directive-stub';
import { AppComponent } from './app.component';

@Component({selector: 'router-outlet', template: ''})
class RouterOutletStubComponent { }

describe('AppComponent', () => {

    let fixture: ComponentFixture<AppComponent>;
    let linkDebugElements: DebugElement[];
    let routerLinks: RouterLinkDirectiveStub[];

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AppComponent,
                RouterLinkDirectiveStub,
                RouterOutletStubComponent
            ],
        }).compileComponents().then(() => {

            fixture = TestBed.createComponent(AppComponent);
            fixture.detectChanges();

            linkDebugElements = fixture.debugElement.queryAll(By.directive(RouterLinkDirectiveStub));
            routerLinks = linkDebugElements.map(debugElement => debugElement.injector.get(RouterLinkDirectiveStub));
        });
    }));

    it('should create the app', async(() => {

        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));

    it('should bind to corresponding links', () => {

        expect(routerLinks.length).toBe(2);
        expect(routerLinks[0].linkParams).toBe('');
        expect(routerLinks[1].linkParams).toBe('/rankings');
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
