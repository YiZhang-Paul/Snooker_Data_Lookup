import { TestBed, inject } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { CountryFlagLookupService } from './country-flag-lookup.service';

describe('CountryFlagLookupService', () => {

    let httpTestingController: HttpTestingController;
    let lookup: CountryFlagLookupService;

    const lookupData = {

        'AF': 'Afghanistan',
        'AO': 'Angola',
        'AU': 'Australia',
        'BE': 'Belgium',
        'BG': 'Bulgaria',
        'BR': 'Brazil'
    };

    const targetFile = '/assets/flags/countries.json';

    beforeEach(() => {

        TestBed.configureTestingModule({

            imports: [HttpClientTestingModule],
            providers: [CountryFlagLookupService]
        });

        httpTestingController = TestBed.get(HttpTestingController);
        lookup = TestBed.get(CountryFlagLookupService);
    });

    it('should be created', inject([CountryFlagLookupService], (service: CountryFlagLookupService) => {

        expect(service).toBeTruthy();
    }));

    it('should load flag urls properly', () => {

        const countries = ['Brazil', 'Bulgaria', 'Angola'];

        lookup.getFlags(countries).subscribe(data => {

            expect(data.size).toEqual(countries.length);

            countries.forEach(country => {

                expect(data.has(country.toLowerCase())).toBeTruthy();
            });
        });

        httpTestingController.expectOne(targetFile).flush(lookupData);
    });

    it('should ignore letter casing for country lookups', () => {

        const countries = ['BrAZiL', 'bulgaria', 'ANGOLA'];

        lookup.getFlags(countries).subscribe(data => {

            expect(data.size).toEqual(countries.length);

            countries.forEach(country => {

                expect(data.has(country.toLowerCase())).toBeTruthy();
            });
        });

        httpTestingController.expectOne(targetFile).flush(lookupData);
    });

    it('should not include unsupported countries in final result', () => {

        const countries = ['Brazil', 'Bulgaria', 'China'];

        lookup.getFlags(countries).subscribe(data => {
            // China is not supported here
            expect(data.size).toEqual(countries.length - 1);

            countries.slice(0, 2).forEach(country => {

                expect(data.has(country.toLowerCase())).toBeTruthy();
            });

            expect(data.has('china')).toBeFalsy();
        });

        httpTestingController.expectOne(targetFile).flush(lookupData);
    });
});
