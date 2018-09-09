import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { HomeComponent } from './home.component';

@Component({ selector: 'app-option-card', template: '' })
class TestOptionCardComponent { @Input() image: string; }

describe('HomeComponent', () => {

    let fixture: ComponentFixture<HomeComponent>;
    let component: HomeComponent;

    beforeEach(async(() => {

        TestBed.configureTestingModule({

            imports: [

                MatToolbarModule,
                MatButtonModule,
                MatIconModule,
                MatMenuModule,
                MatDialogModule
            ],
            declarations: [

                HomeComponent,
                TestOptionCardComponent
            ]

        }).compileComponents();
    }));

    beforeEach(() => {

        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {

        expect(component).toBeTruthy();
    });
});
