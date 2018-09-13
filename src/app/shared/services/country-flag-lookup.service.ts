import { Injectable, Inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG } from '../../app-config';

@Injectable({
    providedIn: 'root'
})
export class CountryFlagLookupService {

    private _flags: Map<string, string> = null;
    private _file = this.configuration.images.flags.lookup;

    constructor(

        @Inject(APP_CONFIG) private configuration,
        private httpClient: HttpClient

    ) { }

    private setFlags(countryCodes: { [key: string]: string }): void {

        const flags = new Map<string, string>();

        Object.keys(countryCodes).forEach(code => {

            flags.set(countryCodes[code], `/assets/flags/${code}.png`);
        });

        this._flags = flags;
    }

    public getFlag(country: string): Observable<string> {

        country = country.toLowerCase();

        return this.getFlags().pipe(

            map(flags => flags.has(country) ? flags.get(country) : null)
        );
    }

    public getFlags(): Observable<Map<string, string>> {

        if (this._flags !== null) {

            return of(this._flags);
        }

        return this.httpClient.get<{ [key: string]: string }>(this._file).pipe(

            map(countryCodes => {

                this.setFlags(countryCodes);

                return this._flags;
            })
        );
    }
}
