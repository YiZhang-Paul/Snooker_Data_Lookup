import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { ContactComponent } from './contact.component';

describe('ContactComponent', () => {

    let component: ContactComponent;
    let fixture: ComponentFixture<ContactComponent>;

    beforeEach(async(() => {

        TestBed.configureTestingModule({

            imports: [MatListModule, MatIconModule],
            declarations: [ContactComponent]

        }).compileComponents();
    }));

    beforeEach(() => {

        fixture = TestBed.createComponent(ContactComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {

        expect(component).toBeTruthy();
    });
});
