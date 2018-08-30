import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerHistoryComponent } from './player-history.component';

describe('PlayerHistoryComponent', () => {

    let fixture: ComponentFixture<PlayerHistoryComponent>;
    let component: PlayerHistoryComponent;

    beforeEach(async(() => {

        TestBed.configureTestingModule({

            declarations: [PlayerHistoryComponent]

        }).compileComponents();
    }));

    beforeEach(() => {

        fixture = TestBed.createComponent(PlayerHistoryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {

        expect(component).toBeTruthy();
    });
});
