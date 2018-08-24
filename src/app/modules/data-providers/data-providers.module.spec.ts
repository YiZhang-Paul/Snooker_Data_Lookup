import { DataProvidersModule } from './data-providers.module';

describe('DataProvidersModule', () => {

    let dataProvidersModule: DataProvidersModule;

    beforeEach(() => {

        dataProvidersModule = new DataProvidersModule();
    });

    it('should create an instance', () => {

        expect(dataProvidersModule).toBeTruthy();
    });
});
