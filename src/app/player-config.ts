import { InjectionToken } from '@angular/core';
import { IPlayer } from './modules/data-providers/players-data/player.interface';

const configuration = {

    // Aditya Mehta
    108: <IPlayer>{

        photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKzi1Vz3AYLOR_Id-n52_nuDA4Iqla6S9LZBe07vnliBSUq93XvA'
    }
};

export const PLAYER_CONFIG = new InjectionToken(

    'config', { providedIn: 'root', factory: () => configuration }
);
