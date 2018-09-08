import { UrlTruncatePipe } from './url-truncate.pipe';

describe('UrlTruncatePipe', () => {

    let pipe: UrlTruncatePipe;

    beforeEach(() => {

        pipe = new UrlTruncatePipe();
    });

    it('create an instance', () => {

        expect(pipe).toBeTruthy();
    });

    it('should remove schemes from urls', () => {

        expect(pipe.transform('https://test.com')).toEqual('test.com');
    });

    it('should remove sub-routes from urls', () => {

        expect(pipe.transform('test.com/sub1/sub2-2/5')).toEqual('test.com');
    });

    it('should remove schemes and sub-routes from urls', () => {

        expect(pipe.transform('http://test.com/sub1/sub2-2/3')).toEqual('test.com');
    });
});
