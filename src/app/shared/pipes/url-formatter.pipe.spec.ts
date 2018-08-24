import { UrlFormatterPipe } from './url-formatter.pipe';

describe('UrlFormatterPipe', () => {

    let pipe: UrlFormatterPipe;

    beforeEach(() => {

        pipe = new UrlFormatterPipe();
    });

    it('create an instance', () => {

        expect(pipe).toBeTruthy();
    });

    it('should format urls without "http(s)://"', () => {

        const url = 'test.com';
        expect(pipe.transform(url)).toEqual(`http://${url}`);
    });

    it('should not format urls with "http(s)://"', () => {

        let url = 'http://test.com';
        expect(pipe.transform(url)).toEqual(url);

        url = 'https://test.com';
        expect(pipe.transform(url)).toEqual(url);
    });
});
