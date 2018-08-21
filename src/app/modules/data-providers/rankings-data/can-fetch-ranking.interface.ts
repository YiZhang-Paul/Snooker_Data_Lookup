import { Observable } from 'rxjs';
import { IRankItem } from './rank-item.interface';

export interface ICanFetchRanking {

    fetch(year: number, type: string): Observable<IRankItem[]>;
}
