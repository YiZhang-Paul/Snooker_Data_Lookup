import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-option-card',
    templateUrl: './option-card.component.html',
    styleUrls: ['./option-card.component.css']
})
export class OptionCardComponent implements OnInit {

    @Input() title: string;
    @Input() image: string;
    @Input() link: string;

    constructor() { }

    ngOnInit() {
    }
}
