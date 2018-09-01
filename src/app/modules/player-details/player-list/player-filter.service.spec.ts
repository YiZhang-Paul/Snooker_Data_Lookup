import { TestBed, inject } from '@angular/core/testing';
import { IPlayer } from '../../data-providers/players-data/player.interface';
import { PlayerFilterService } from './player-filter.service';

describe('PlayerFilterService', () => {

    const players = <IPlayer[]>[

        { nationality: 'three-body', get shortFullName(): string { return 'John Doe'; } },
        { nationality: 'three-body', get shortFullName(): string { return 'Jane Doe'; } },
        { nationality: 'china', get shortFullName(): string { return 'Jim Moe'; } }
    ];

    let filter: PlayerFilterService;

    beforeEach(() => {

        TestBed.configureTestingModule({

            providers: [PlayerFilterService]
        });

        filter = TestBed.get(PlayerFilterService);
    });

    it('should be created', inject([PlayerFilterService], (service: PlayerFilterService) => {

        expect(service).toBeTruthy();
    }));

    it('should not filter players when nationality filter is empty', () => {

        expect(filter.filterByNationality(players, '')).toEqual(players);
    });

    it('should filter players with nationality filter', () => {

        expect(filter.filterByNationality(players, 'china')).toEqual(players.slice(2));
        expect(filter.filterByNationality(players, 'three-body')).toEqual(players.slice(0, 2));
    });

    it('should not filter players when name filter is empty', () => {

        expect(filter.filterByName(players, '')).toEqual(players);
    });

    it('should filter players with name filter', () => {

        expect(filter.filterByName(players, 'jim')).toEqual(players.slice(2));
        // 'no' matches 'n' and 'o' in names 'Joh(n) D(o)e' and 'Ja(n)e D(o)e'
        expect(filter.filterByName(players, 'no')).toEqual(players.slice(0, 2));
    });
});
