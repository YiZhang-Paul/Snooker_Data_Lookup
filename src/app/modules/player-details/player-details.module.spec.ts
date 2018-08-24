import { PlayerDetailsModule } from './player-details.module';

describe('PlayerDetailsModule', () => {

    let playerDetailsModule: PlayerDetailsModule;

    beforeEach(() => {

        playerDetailsModule = new PlayerDetailsModule();
    });

    it('should create an instance', () => {

        expect(playerDetailsModule).toBeTruthy();
    });
});
