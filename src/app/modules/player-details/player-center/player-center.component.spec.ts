import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterLinkStubDirective } from '../../../../testing/router-link-stub-directive';
import { MatTabsModule } from '@angular/material/tabs';
import { PlayerCenterComponent } from './player-center.component';

// tslint:disable:component-selector
@Component({ selector: 'router-outlet', template: '' })
class RouterOutletStubComponent { }

describe('PlayerCenterComponent', () => {

    let fixture: ComponentFixture<PlayerCenterComponent>;
    let component: PlayerCenterComponent;

    beforeEach(async(() => {

        TestBed.configureTestingModule({

            imports: [RouterTestingModule, MatTabsModule],
            declarations: [

                PlayerCenterComponent,
                RouterLinkStubDirective,
                RouterOutletStubComponent
            ]

        }).compileComponents();
    }));

    beforeEach(() => {

        fixture = TestBed.createComponent(PlayerCenterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {

        expect(component).toBeTruthy();
    });
});
