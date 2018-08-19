import { Observable } from 'rxjs';

export interface ICanFetchRanking {

    fetch(year: number, type: string): Observable<string>;
}
