import { Observable } from 'rxjs';
import { IPlayer } from './player.interface';

export interface ICanFetchPlayer {

    fetch(year: number): Observable<IPlayer[]>;
}
