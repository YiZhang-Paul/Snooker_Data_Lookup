import { Component, OnInit, Inject } from '@angular/core';
import { AboutComponent } from '../../dialogues/about/about.component';
import { ContactComponent } from '../../dialogues/contact/contact.component';
import { MatDialog } from '@angular/material';
import { APP_CONFIG } from '../../app-config';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    constructor(

        @Inject(APP_CONFIG) readonly configuration,
        private dialog: MatDialog

    ) { }

    ngOnInit() {
    }

    public openAboutDialog(): void {

        this.dialog.open(AboutComponent);
    }

    public openContactDialog(): void {

        this.dialog.open(ContactComponent);
    }
}
