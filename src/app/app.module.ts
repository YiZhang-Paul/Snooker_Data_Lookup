import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { DataCacheService } from './shared/services/data-cache.service';
import { CachingInterceptorService } from './shared/interceptors/caching-interceptor.service';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule
    ],
    providers: [
        DataCacheService,
        { provide: HTTP_INTERCEPTORS, useClass: CachingInterceptorService, multi: true}
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
