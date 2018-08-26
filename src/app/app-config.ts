import { InjectionToken } from '@angular/core';

const configuration = { startYear: 2013 };

export const APP_CONFIG = new InjectionToken(

    'config', { providedIn: 'root', factory: () => configuration }
);
