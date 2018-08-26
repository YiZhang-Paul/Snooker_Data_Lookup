import { Component, OnInit } from '@angular/core';
import { IPlayer } from '../../data-providers/players-data/player.interface';
import { PlayerLookupService } from '../../data-providers/players-data/player-lookup.service';

@Component({
    selector: 'app-player-list',
    templateUrl: './player-list.component.html',
    styleUrls: ['./player-list.component.css']
})
export class PlayerListComponent implements OnInit {

    private _players: IPlayer[] = [];

    constructor(private lookup: PlayerLookupService) { }

    get players(): IPlayer[] {

        return this._players;
    }

    ngOnInit() {

        this.lookup.players$.subscribe(players => {

            this._players = this.sortPlayers(players);
        });
    }

    private sortPlayers(players: Map<number, IPlayer>): IPlayer[] {

        return Array.from(players.values()).sort((a, b) => a.id - b.id);
    }

    public trackById(index: number, player: IPlayer): number {

        return player.id;
    }
}
