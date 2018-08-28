import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerAllStatsComponent } from './player-all-stats.component';

describe('PlayerAllStatsComponent', () => {
  let component: PlayerAllStatsComponent;
  let fixture: ComponentFixture<PlayerAllStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerAllStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerAllStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
