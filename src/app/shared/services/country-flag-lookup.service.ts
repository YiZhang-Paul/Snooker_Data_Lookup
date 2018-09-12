import { Injectable, Inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG } from '../../app-config';

@Injectable({
    providedIn: 'root'
})
export class CountryFlagLookupService {

    private _lookup: Map<string, string> = null;

    constructor(

        @Inject(APP_CONFIG) private configuration,
        private httpClient: HttpClient

    ) { }

    private setLookup(): Observable<Map<string, string>> {

        const file = this.configuration.images.flags.lookup;

        return this.httpClient.get<object>(file).pipe(

            map(data => {

                this._lookup = new Map<string, string>();

                Object.keys(data).forEach(key => {

                    this._lookup.set(data[key].toLowerCase(), key);
                });

                return this._lookup;
            })
        );
    }

    public getFlags(countries: string[]): Observable<Map<string, string>> {

        return (this._lookup ? of(this._lookup) : this.setLookup()).pipe(

            map(lookup => {

                const flags = new Map<string, string>();

                countries.map(country => country.toLowerCase()).forEach(country => {

                    if (lookup.has(country)) {

                        flags.set(country, `/assets/flags/${lookup.get(country)}.png`);
                    }
                });

                return flags;
            })
        );
    }
}
