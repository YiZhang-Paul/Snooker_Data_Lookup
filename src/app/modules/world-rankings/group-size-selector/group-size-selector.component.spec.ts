import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { queryByCss, queryByDirective, triggerEventByCss } from '../../../../testing/custom-test-utilities';
import { GroupSizeSelectorComponent } from '../group-size-selector/group-size-selector.component';

const groupSize = 150;

@Component({
    template: `
        <app-group-size-selector
            [currentGroup]="currentGroup"
            [totalGroups]="totalGroups"
            [size]="${groupSize}"
            (groupChange)="onGroupChanged($event)"
            (sizeSelect)="onSizeSelected($event)">
        </app-group-size-selector>
    `
})
class TestComponent {

    currentGroup = 2;
    totalGroups = 5;
    selected = false;
    size = -1;

    onGroupChanged(direction: number): void {

        this.currentGroup += direction > 0 ? 1 : -1;
    }

    onSizeSelected(size: number): void {

        this.selected = true;
        this.size = size;
    }
}

describe('GroupSizeSelectorComponent', () => {

    let fixture: ComponentFixture<TestComponent>;
    let component: TestComponent;
    let selectorDebugElement: DebugElement;
    let selector: GroupSizeSelectorComponent;

    beforeEach(async(() => {

        TestBed.configureTestingModule({

            imports: [FormsModule],
            declarations: [GroupSizeSelectorComponent, TestComponent]

        }).compileComponents();
    }));

    beforeEach(() => {

        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        selectorDebugElement = queryByDirective(fixture.debugElement, GroupSizeSelectorComponent);
        selector = selectorDebugElement.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {

        expect(component).toBeTruthy();
    });

    it('should bind values properly', () => {

        expect(selector.currentGroup).toEqual(component.currentGroup);
        expect(selector.totalGroups).toEqual(component.totalGroups);
        expect(selector.size).toEqual(groupSize);
    });

    it('should indicate group changes properly', () => {

        const currentGroup = selector.currentGroup;
        const previousGroup = queryByCss(selectorDebugElement, '.previous');
        const nextGroup = queryByCss(selectorDebugElement, '.next');

        nextGroup.triggerEventHandler('click', null);
        expect(component.currentGroup).toEqual(currentGroup + 1);

        nextGroup.triggerEventHandler('click', null);
        expect(component.currentGroup).toEqual(currentGroup + 2);

        previousGroup.triggerEventHandler('click', null);
        expect(component.currentGroup).toEqual(currentGroup + 1);
    });

    it('should report valid size when enter is pressed while text box is selected', () => {

        expect(component.selected).toBeFalsy();
        expect(component.size).not.toEqual(groupSize);

        triggerEventByCss(selectorDebugElement, '.sizeInput', 'keyup.enter');

        expect(component.selected).toBeTruthy();
        expect(component.size).toEqual(groupSize);
    });

    it('should report valid size when "show" button is clicked', () => {

        expect(component.selected).toBeFalsy();
        expect(component.size).not.toEqual(groupSize);

        triggerEventByCss(selectorDebugElement, '.showSize', 'click');

        expect(component.selected).toBeTruthy();
        expect(component.size).toEqual(groupSize);
    });

    it('should not report invalid size when "show" button or enter key is pressed', () => {

        selector.size = NaN;
        expect(component.selected).toBeFalsy();

        triggerEventByCss(selectorDebugElement, '.sizeInput', 'keyup.enter');
        expect(component.selected).toBeFalsy();

        triggerEventByCss(selectorDebugElement, '.showSize', 'click');
        expect(component.selected).toBeFalsy();
    });

    it('should always report size when "all" button is clicked', () => {

        expect(component.selected).toBeFalsy();
        expect(component.size).not.toEqual(groupSize);

        triggerEventByCss(selectorDebugElement, '.showAll', 'click');

        expect(component.selected).toBeTruthy();
        expect(component.size).toEqual(-1);
    });
});
