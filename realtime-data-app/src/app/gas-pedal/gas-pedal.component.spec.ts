import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GasPedalComponent } from './gas-pedal.component';

describe('GasPedalComponent', () => {
  let component: GasPedalComponent;
  let fixture: ComponentFixture<GasPedalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GasPedalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GasPedalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
