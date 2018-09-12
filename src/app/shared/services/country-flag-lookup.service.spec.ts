import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CountryFlagLookupService } from './country-flag-lookup.service';

describe('CountryFlagLookupService', () => {

    let httpTestingController: HttpTestingController;
    let lookup: CountryFlagLookupService;

    const lookupData = {

        'af': 'afghanistan',
        'ao': 'angola',
        'au': 'australia',
        'be': 'belgium',
        'bg': 'bulgaria',
        'br': 'brazil'
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

    afterEach(() => {

        httpTestingController.verify();
    });

    it('should be created', inject([CountryFlagLookupService], (service: CountryFlagLookupService) => {

        expect(service).toBeTruthy();
    }));

    it('should ignore letter casing', () => {

        lookup.getFlag('BrAZil').subscribe(data => {

            expect(data).toEqual('/assets/flags/br.png');
        });

        httpTestingController.expectOne(targetFile).flush(lookupData);

        lookup.getFlag('ANGOLA').subscribe(data => {

            expect(data).toEqual('/assets/flags/ao.png');
        });

        httpTestingController.expectOne(targetFile).flush(lookupData);
    });

    it('should return null for unsupported countries', () => {

        lookup.getFlag('three-body').subscribe(data => {

            expect(data).toBeNull();
        });

        httpTestingController.expectOne(targetFile).flush(lookupData);
    });
});
