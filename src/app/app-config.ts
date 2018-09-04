import { InjectionToken } from '@angular/core';

// tslint:disable:max-line-length
export const startYear = 2013;

const configuration = {

    startYear,

    images: {

        home: {

            players: 'https://i.eurosport.com/2018/02/27/2283151-47561815-2560-1440.jpg?w=1050',
            rankings: 'https://cdn.images.express.co.uk/img/dynamic/4/590x/Ronnie-O-Sullivan-994407.jpg?r=1532575948666',
            events: 'https://www.telegraph.co.uk/content/dam/snooker/2017/04/14/TELEMMGLPICT000125854438_trans_NvBQzQNjv4BqIgboy7m2Vnp-xkpo1Nlwzv4cBevEAptvg3sn-Fm9TnE.jpeg?imwidth=350'
        }
    }
};

export const APP_CONFIG = new InjectionToken(

    'config', { providedIn: 'root', factory: () => configuration }
);
