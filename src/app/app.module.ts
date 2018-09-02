import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { DataProvidersModule } from './modules/data-providers/data-providers.module';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './layouts/home/home.component';
import { SiteComponent } from './layouts/site/site.component';

import { DataCacheService } from './shared/services/data-cache.service';
import { CachingInterceptorService } from './shared/interceptors/caching-interceptor.service';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        SiteComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        SharedModule,
        DataProvidersModule,
        AppRoutingModule
    ],
    providers: [
        DataCacheService,
        { provide: HTTP_INTERCEPTORS, useClass: CachingInterceptorService, multi: true}
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
