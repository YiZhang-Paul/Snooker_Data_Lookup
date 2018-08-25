import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { IPlayer } from '../../data-providers/players-data/player.interface';
import { PlayerLookupService } from '../../data-providers/players-data/player-lookup.service';

@Component({
    selector: 'app-player-information',
    templateUrl: './player-information.component.html',
    styleUrls: ['./player-information.component.css']
})
export class PlayerInformationComponent implements OnInit {

    private _player: IPlayer;

    constructor(

        private routes: ActivatedRoute,
        private lookup: PlayerLookupService

    ) { }

    get player(): IPlayer {

        return this._player;
    }

    ngOnInit() {

        this.routes.parent.paramMap.pipe(

            switchMap(params => {

                const id = Number(params.get('id'));

                return this.lookup.getPlayer(id);
            })

        ).subscribe(player => {

            this._player = player;
        });
    }
}
