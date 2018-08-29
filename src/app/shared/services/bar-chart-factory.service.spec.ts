import { TestBed, inject } from '@angular/core/testing';
import { BarChartFactoryService } from './bar-chart-factory.service';

describe('BarChartFactoryService', () => {

    beforeEach(() => {

        TestBed.configureTestingModule({

            providers: [BarChartFactoryService]
        });
    });

    it('should be created', inject([BarChartFactoryService], (service: BarChartFactoryService) => {

        expect(service).toBeTruthy();
    }));
});
