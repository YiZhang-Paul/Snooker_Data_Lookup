import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QueryByCss, QueryByDirective, TriggerEventByCss } from '../../../../testing/custom-test-utilities';
import { GroupSizeSelectorComponent } from '../group-size-selector/group-size-selector.component';

@Component({
    template: `
        <app-group-size-selector
            [currentGroup]="currentGroup"
            [totalGroups]="totalGroups"
            [size]="150"
            (groupChange)="onGroupChanged($event)"
            (select)="onSizeSelected($event)">
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
    let testComponent: TestComponent;
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
        testComponent = fixture.componentInstance;
        selectorDebugElement = QueryByDirective(fixture.debugElement, GroupSizeSelectorComponent);
        selector = selectorDebugElement.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(testComponent).toBeTruthy();
    });

    it('should bind values properly', () => {

        expect(selector.currentGroup).toEqual(testComponent.currentGroup);
        expect(selector.totalGroups).toEqual(testComponent.totalGroups);
        expect(selector.size).toEqual(150);
    });

    it('should indicate group changes properly', () => {

        const currentGroup = selector.currentGroup;
        const previous = QueryByCss(selectorDebugElement, '.previous');
        const next = QueryByCss(selectorDebugElement, '.next');

        next.triggerEventHandler('click', null);
        expect(testComponent.currentGroup).toEqual(currentGroup + 1);

        next.triggerEventHandler('click', null);
        expect(testComponent.currentGroup).toEqual(currentGroup + 2);

        previous.triggerEventHandler('click', null);
        expect(testComponent.currentGroup).toEqual(currentGroup + 1);
    });

    it('should report valid size when enter is pressed while text box is selected', () => {

        expect(testComponent.selected).toBeFalsy();
        expect(testComponent.size).not.toEqual(150);

        TriggerEventByCss(selectorDebugElement, '.sizeInput', 'keyup.enter');

        expect(testComponent.selected).toBeTruthy();
        expect(testComponent.size).toEqual(150);
    });

    it('should report valid size when "show" button is clicked', () => {

        expect(testComponent.selected).toBeFalsy();
        expect(testComponent.size).not.toEqual(150);

        TriggerEventByCss(selectorDebugElement, '.showSize', 'click');

        expect(testComponent.selected).toBeTruthy();
        expect(testComponent.size).toEqual(150);
    });

    it('should not report invalid size when "show" button or enter key is pressed', () => {

        selector.size = NaN;
        expect(testComponent.selected).toBeFalsy();

        TriggerEventByCss(selectorDebugElement, '.sizeInput', 'keyup.enter');
        TriggerEventByCss(selectorDebugElement, '.showSize', 'click');

        expect(testComponent.selected).toBeFalsy();
    });

    it('should always report size when "all" button is clicked', () => {

        expect(testComponent.selected).toBeFalsy();
        expect(testComponent.size).not.toEqual(150);

        TriggerEventByCss(selectorDebugElement, '.showAll', 'click');

        expect(testComponent.selected).toBeTruthy();
        expect(testComponent.size).toEqual(-1);
    });
});
