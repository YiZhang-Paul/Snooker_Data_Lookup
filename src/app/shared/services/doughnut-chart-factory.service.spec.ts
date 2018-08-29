import { TestBed, inject } from '@angular/core/testing';
import { DoughnutChartFactoryService } from './doughnut-chart-factory.service';

describe('DoughnutChartFactoryService', () => {

    beforeEach(() => {

        TestBed.configureTestingModule({

            providers: [DoughnutChartFactoryService]
        });
    });

    it('should be created', inject([DoughnutChartFactoryService], (service: DoughnutChartFactoryService) => {

        expect(service).toBeTruthy();
    }));
});
