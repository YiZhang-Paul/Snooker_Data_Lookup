import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG } from '../../app-config';

@Injectable({
    providedIn: 'root'
})
export class CountryFlagLookupService {

    private _flags: Map<string, string> = null;

    constructor(

        @Inject(APP_CONFIG) private configuration,
        private httpClient: HttpClient

    ) { }

    private setFlags(countryCodes: { [key: string]: string }): void {

        this._flags = new Map<string, string>();

        Object.keys(countryCodes).forEach(code => {

            this._flags.set(countryCodes[code], `/assets/flags/${code}.png`);
        });
    }

    public getFlag(country: string): Observable<string> {

        const file = this.configuration.images.flags.lookup;
        country = country.toLowerCase();

        return this.httpClient.get<{ [key: string]: string }>(file).pipe(

            tap(countryCodes => {

                if (this._flags === null) {

                    this.setFlags(countryCodes);
                }
            }),
            map(() => this._flags.has(country) ? this._flags.get(country) : null)
        );
    }
}
