import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
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

    private _player$: Observable<IPlayer>;

    constructor(

        private route: ActivatedRoute,
        private lookup: PlayerLookupService

    ) { }

    get player$(): Observable<IPlayer> {

        return this._player$;
    }

    ngOnInit() {

        this._player$ = this.route.parent.paramMap.pipe(

            switchMap(params => {

                const id = Number(params.get('id'));
                const year = Number(params.get('year'));

                return this.lookup.getPlayer(year, id);
            })
        );
    }
}
