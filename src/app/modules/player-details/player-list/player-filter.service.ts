import { Injectable } from '@angular/core';
import { IPlayer } from '../../data-providers/players-data/player.interface';

@Injectable({
    providedIn: 'root'
})
export class PlayerFilterService {

    constructor() { }

    public filterByNationality(players: IPlayer[], nationality: string): IPlayer[] {

        if (!nationality) {

            return players;
        }

        return players.filter(player => player.nationality === nationality);
    }

    public filterByName(players: IPlayer[], name: string): IPlayer[] {

        return players.filter(player => {

            const fullName = player.shortFullName.toLowerCase();

            for (let i = 0, j = 0; i < name.length; i++) {

                j = fullName.indexOf(name[i], j) + 1;

                if (j === 0) {

                    return false;
                }
            }

            return true;
        });
    }
}
