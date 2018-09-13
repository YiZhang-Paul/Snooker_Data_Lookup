import { Injectable, Inject } from '@angular/core';
import { IPlayer } from './player.interface';
import { Player } from './player';
import { PLAYER_CONFIG } from '../../../player-config';

@Injectable({
    providedIn: 'root'
})
export class PlayerDataFixerService {

    constructor(@Inject(PLAYER_CONFIG) private configuration) { }

    private replace(configuration: object, player: IPlayer, property: string): any {

        if (configuration.hasOwnProperty(property)) {

            return configuration[property];
        }

        return player[property];
    }

    public fix(player: IPlayer): IPlayer {

        const configuration = this.configuration[player.id];

        if (!configuration) {

            return player;
        }

        return new Player(

            player.id,
            this.replace(configuration, player, 'firstName'),
            this.replace(configuration, player, 'middleName'),
            this.replace(configuration, player, 'lastName'),
            this.replace(configuration, player, 'shortName'),
            this.replace(configuration, player, 'dateOfBirth'),
            this.replace(configuration, player, 'sex'),
            this.replace(configuration, player, 'nationality'),
            this.replace(configuration, player, 'photo'),
            this.replace(configuration, player, 'bioPage'),
            this.replace(configuration, player, 'website'),
            this.replace(configuration, player, 'twitter'),
            this.replace(configuration, player, 'turnedPro'),
            this.replace(configuration, player, 'lastSeasonPlayed')
        );
    }
}
