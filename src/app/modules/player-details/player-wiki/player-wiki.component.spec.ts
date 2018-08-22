import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerWikiComponent } from './player-wiki.component';

describe('PlayerWikiComponent', () => {
  let component: PlayerWikiComponent;
  let fixture: ComponentFixture<PlayerWikiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerWikiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerWikiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
