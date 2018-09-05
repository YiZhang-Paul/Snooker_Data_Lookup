import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
    selector: 'app-player-center',
    templateUrl: './player-center.component.html',
    styleUrls: ['./player-center.component.css']
})
export class PlayerCenterComponent implements OnInit {

    readonly links = ['list', 'allstats'];
    readonly texts = ['All Players', 'Statistics'];
    public active: string;

    constructor(private router: Router) { }

    ngOnInit() {

        this.checkActiveTab(this.router.url);

        this.router.events.subscribe(event => {

            if (event instanceof NavigationEnd) {

                this.checkActiveTab((<NavigationEnd>event).url);
            }
        });
    }

    private checkActiveTab(url: string): void {

        for (let i = 0; i < this.links.length; i++) {

            const pattern = new RegExp(`/${this.links[i]}$`);

            if (pattern.test(url)) {

                this.active = this.links[i];

                break;
            }
        }
    }
}
