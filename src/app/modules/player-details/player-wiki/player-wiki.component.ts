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
    private tabs = ['details', 'stats', 'history', 'graphs'];

    public activeTab: MatButton;

    constructor(private router: Router) { }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {

        const timeout = setTimeout(() => {

            this.setActiveTabs(this.router.url);
            clearTimeout(timeout);
        });
    }

    private setActiveTabs(url: string): void {

        for (let i = 0; i < this.tabs.length; i++) {

            const pattern = new RegExp(`/${this.tabs[i]}`);

            if (pattern.test(url)) {

                this.toggleGroup.value = this.tabs[i];
                this.activeTab = this[`${this.tabs[i]}Tab`];

                break;
            }
        }
    }

    public setActiveTab(tab: string): void {

        if (this.tabs.includes(tab)) {

            this.activeTab = this[`${tab}Tab`];
            this.toggleGroup.value = tab;
        }
    }
}
