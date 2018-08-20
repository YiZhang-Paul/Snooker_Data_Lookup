import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-group-size-selector',
    templateUrl: './group-size-selector.component.html',
    styleUrls: ['./group-size-selector.component.css']
})
export class GroupSizeSelectorComponent {

    @Input() currentGroup = 1;
    @Input() totalGroups = 1;
    @Input() size: number;
    @Output() groupChange = new EventEmitter<number>();
    @Output() sizeSelect = new EventEmitter<number>();

    constructor() { }

    public onGroupChange(direction: number): void {

        this.groupChange.emit(direction > 0 ? 1 : -1);
    }

    public onSizeSelect(size: number = null): void {

        if (size !== null) {

            this.sizeSelect.emit(size);

            return;
        }

        if (!isNaN(this.size)) {

            this.sizeSelect.emit(this.size);
        }
    }
}
