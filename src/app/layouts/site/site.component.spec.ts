import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement, Input } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterLinkStubDirective, getLinkStubs } from '../../../testing/router-link-stub-directive';
import { SiteComponent } from './site.component';

// tslint:disable:component-selector
// tslint:disable:component-class-suffix
@Component({ selector: 'router-outlet', template: '' })
class RouterOutletStubComponent { }

@Component({ selector: 'mat-toolbar', template: '' })
class TestMatToolbar { }

@Component({ selector: 'mat-menu', template: '', exportAs: 'matMenu' })
class TestMatMenu { }

@Component({ selector: 'button', template: '' })
class TestButton { @Input() matMenuTriggerFor: any; }

@Component({ selector: 'mat-icon', template: '' })
class TestMatIcon { }

describe('SiteComponent', () => {

    let fixture: ComponentFixture<SiteComponent>;
    let component: SiteComponent;
    let linkDebugElements: DebugElement[];
    let routerLinks: RouterLinkStubDirective[];

    beforeEach(async(() => {

        TestBed.configureTestingModule({

            imports: [RouterTestingModule],
            declarations: [

                SiteComponent,
                RouterOutletStubComponent,
                RouterLinkStubDirective,
                TestMatToolbar,
                TestMatMenu,
                TestButton,
                TestMatIcon
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
});
