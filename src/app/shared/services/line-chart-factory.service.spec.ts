import { TestBed, inject } from '@angular/core/testing';
import { LineChartFactoryService } from './line-chart-factory.service';

describe('LineChartFactoryService', () => {

    beforeEach(() => {

        TestBed.configureTestingModule({

            providers: [LineChartFactoryService]
        });
    });

    it('should be created', inject([LineChartFactoryService], (service: LineChartFactoryService) => {

        expect(service).toBeTruthy();
    }));
});
