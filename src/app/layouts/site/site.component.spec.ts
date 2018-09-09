import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterLinkStubDirective, getLinkStubs } from '../../../testing/router-link-stub-directive';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
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

            imports: [

                RouterTestingModule,
                MatDialogModule,
                MatToolbarModule,
                MatMenuModule,
                MatIconModule
            ],
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
});
