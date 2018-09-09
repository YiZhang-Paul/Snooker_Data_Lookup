import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AboutComponent } from '../../dialogues/about/about.component';
import { ContactComponent } from '../../dialogues/contact/contact.component';
import { MatDialog } from '@angular/material';

@Component({
    selector: 'app-site',
    templateUrl: './site.component.html',
    styleUrls: ['./site.component.css']
})
export class SiteComponent implements OnInit {

    private _buttonIds = ['players', 'rankings'];

    constructor(

        private router: Router,
        private dialog: MatDialog

    ) { }

    ngOnInit(): void {

        this.checkActiveButton(this.router.url);

        this.router.events.subscribe(event => {

            if (event instanceof NavigationEnd) {

                this.checkActiveButton((<NavigationEnd>event).url);
            }
        });
    }

    public openAboutDialog(): void {

        this.dialog.open(AboutComponent);
    }

    public openContactDialog(): void {

        this.dialog.open(ContactComponent);
    }

    private removeClass(id: string, className: string): void {

        const element = document.getElementById(id);

        if (element) {

            element.classList.remove(className);
        }
    }

    private addClass(id: string, className: string): void {

        const element = document.getElementById(id);

        if (element) {

            element.classList.add(className);
        }
    }

    private setActiveButton(id: string, className: string): void {

        this._buttonIds.forEach(buttonId => {

            this.removeClass(buttonId, className);
        });

        this.addClass(id, className);
    }

    private checkActiveButton(url: string): void {

        const activeClass = 'active-tab';

        if (/\/site\/players/.test(url)) {

            this.setActiveButton('players', activeClass);
        }

        if (/\/site\/rankings/.test(url)) {

            this.setActiveButton('rankings', activeClass);
        }
    }
}
