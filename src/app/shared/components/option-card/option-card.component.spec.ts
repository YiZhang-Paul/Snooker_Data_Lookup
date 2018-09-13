import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { RouterLinkStubDirective } from '../../../../testing/router-link-stub-directive';
import { queryByDirective } from '../../../../testing/custom-test-utilities';
import { OptionCardComponent } from './option-card.component';

@Component({
    template: `
        <app-option-card
            [title]="title"
            [link]="link"
            [image]="image">
        </app-option-card>
    `
})
class TestComponent {

    title = 'test-title';
    link = 'test-link';
    image = 'favicon.ico';
}

describe('OptionCardComponent', () => {

    let fixture: ComponentFixture<TestComponent>;
    let component: TestComponent;
    let cardDebugElement: DebugElement;
    let card: OptionCardComponent;

    beforeEach(async(() => {

        TestBed.configureTestingModule({

            declarations: [

                RouterLinkStubDirective,
                OptionCardComponent,
                TestComponent
            ]

        }).compileComponents();
    }));

    beforeEach(() => {

        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        cardDebugElement = queryByDirective(fixture.debugElement, OptionCardComponent);
        card = cardDebugElement.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {

        expect(component).toBeTruthy();
    });

    it('should bind values properly', () => {

        expect(card.title).toEqual(component.title);
        expect(card.link).toEqual(component.link);
        expect(card.image).toEqual(component.image);
    });
});
