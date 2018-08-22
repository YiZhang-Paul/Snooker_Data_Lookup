import { Observable } from 'rxjs';
import { IRankData } from './rank-data.interface';

export interface ICanFetchRanking {

    fetch(year: number, type: string): Observable<IRankData[]>;
}
