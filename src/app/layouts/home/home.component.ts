import { Component, OnInit, Inject } from '@angular/core';
import { APP_CONFIG } from '../../app-config';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    constructor(@Inject(APP_CONFIG) readonly configuration) { }

    ngOnInit() {
    }
}
