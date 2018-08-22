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

        private route: ActivatedRoute,
        private lookup: PlayerLookupService

    ) { }

    get player(): IPlayer {

        return this._player;
    }

    ngOnInit() {

        this.route.parent.paramMap.pipe(

            switchMap(params => {

                const id = Number(params.get('id'));
                const year = Number(params.get('year'));

                return this.lookup.getPlayer(year, id);
            })

        ).subscribe(player => {

            this._player = player;
        });
    }
}