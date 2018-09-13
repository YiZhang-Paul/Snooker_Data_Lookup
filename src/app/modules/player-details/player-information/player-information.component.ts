import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { IPlayer } from '../../data-providers/players-data/player.interface';
import { PlayerLookupService } from '../../data-providers/players-data/player-lookup.service';
import { CountryFlagLookupService } from '../../../shared/services/country-flag-lookup.service';

@Component({
    selector: 'app-player-information',
    templateUrl: './player-information.component.html',
    styleUrls: ['./player-information.component.css']
})
export class PlayerInformationComponent implements OnInit {

    private _player: IPlayer;
    private _flag: string = null;

    public isLoaded = false;

    constructor(

        private routes: ActivatedRoute,
        private playerLookup: PlayerLookupService,
        private flagLookup: CountryFlagLookupService

    ) { }

    get player(): IPlayer {

        return this._player;
    }

    get flag(): string {

        return this._flag;
    }

    ngOnInit() {

        this.routes.parent.paramMap.pipe(

            switchMap(params => {

                const id = Number(params.get('id'));

                return this.playerLookup.getPlayer(id);
            })

        ).subscribe(player => {

            this._player = player;
            this.setFlag(player.nationality);
            this.isLoaded = true;
        });
    }

    private setFlag(country: string): void {

        this.flagLookup.getFlag(country).subscribe(flag => {

            this._flag = flag;
        });
    }
}
