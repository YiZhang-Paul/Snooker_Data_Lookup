import { InjectionToken } from '@angular/core';

export const startYear = 2013;

const configuration = { startYear };

export const APP_CONFIG = new InjectionToken(

    'config', { providedIn: 'root', factory: () => configuration }
);
