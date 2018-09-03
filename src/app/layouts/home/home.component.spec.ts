import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { HomeComponent } from './home.component';

// tslint:disable:component-selector
// tslint:disable:component-class-suffix
// tslint:disable:directive-selector
// tslint:disable:directive-class-suffix
@Component({ selector: 'button', template: '' })
class TestButton { @Input() matMenuTriggerFor: any; }

@Component({ selector: 'mat-toolbar', template: '' })
class TestMatToolbar { }

@Component({ selector: 'mat-button', template: '' })
class TestMatButton { }

@Component({ selector: 'mat-mini-fab', template: '' })
class TestMatMiniFab { }

@Component({ selector: 'mat-icon', template: '' })
class TestMatIcon { }

@Component({ selector: 'mat-menu', template: '', exportAs: 'matMenu' })
class TestMatMenu { }

@Component({ selector: 'mat-menu-item', template: '' })
class TestMatMenuItem { }

@Component({ selector: 'app-option-card', template: '' })
class TestOptionCardComponent { }

describe('HomeComponent', () => {

    let fixture: ComponentFixture<HomeComponent>;
    let component: HomeComponent;

    beforeEach(async(() => {

        TestBed.configureTestingModule({

            declarations: [

                HomeComponent,
                TestButton,
                TestMatToolbar,
                TestMatButton,
                TestMatIcon,
                TestMatMiniFab,
                TestMatMenu,
                TestMatMenuItem,
                TestOptionCardComponent
            ]

        }).compileComponents();
    }));

    beforeEach(() => {

        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {

        expect(component).toBeTruthy();
    });
});
