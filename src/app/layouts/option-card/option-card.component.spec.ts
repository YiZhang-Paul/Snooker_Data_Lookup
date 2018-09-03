import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { RouterLinkStubDirective } from '../../../testing/router-link-stub-directive';
import { OptionCardComponent } from './option-card.component';

// tslint:disable:component-selector
// tslint:disable:component-class-suffix
@Component({ selector: 'mat-card', template: '' })
class TestMatCard {}

@Component({ selector: 'mat-card-header', template: '' })
class TestMatCardHeader {}

@Component({ selector: 'mat-card-title', template: '' })
class TestMatCardTitle {}

@Component({ selector: 'mat-card-content', template: '' })
class TestMatCardContent {}

describe('OptionCardComponent', () => {

    let fixture: ComponentFixture<OptionCardComponent>;
    let component: OptionCardComponent;

    beforeEach(async(() => {

        TestBed.configureTestingModule({

            declarations: [

                OptionCardComponent,
                TestMatCard,
                TestMatCardHeader,
                TestMatCardTitle,
                TestMatCardContent,
                RouterLinkStubDirective
            ]

        }).compileComponents();
    }));

    beforeEach(() => {

        fixture = TestBed.createComponent(OptionCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {

        expect(component).toBeTruthy();
    });
});
