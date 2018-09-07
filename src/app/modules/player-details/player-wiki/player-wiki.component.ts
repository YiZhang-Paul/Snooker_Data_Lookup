import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatButtonToggleGroup } from '@angular/material/button-toggle';

@Component({
    selector: 'app-player-wiki',
    templateUrl: './player-wiki.component.html',
    styleUrls: ['./player-wiki.component.css']
})
export class PlayerWikiComponent implements OnInit, AfterViewInit {

    @ViewChild('details') private detailsTab: MatButton;
    @ViewChild('stats') private statsTab: MatButton;
    @ViewChild('history') private historyTab: MatButton;
    @ViewChild('graphs') private graphsTab: MatButton;
    @ViewChild('toggleGroup') private toggleGroup: MatButtonToggleGroup;

    public activeTab: MatButton;

    constructor(private router: Router) { }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {

        const timeout = setTimeout(() => {

            this.setActiveTab(this.router.url);
            clearTimeout(timeout);
        });
    }

    private setActiveTab(url: string): void {

        const tabs = ['details', 'stats', 'history', 'graphs'];

        for (let i = 0; i < tabs.length; i++) {

            const pattern = new RegExp(`/${tabs[i]}`);

            if (pattern.test(url)) {

                this.toggleGroup.value = tabs[i];
                this.activeTab = this[`${tabs[i]}Tab`];

                break;
            }
        }
    }
}
