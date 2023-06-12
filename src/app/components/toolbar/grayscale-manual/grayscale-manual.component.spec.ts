import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrayscaleManualComponent } from './grayscale-manual.component';

describe('GrayscaleManualComponent', () => {
  let component: GrayscaleManualComponent;
  let fixture: ComponentFixture<GrayscaleManualComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GrayscaleManualComponent],
    });
    fixture = TestBed.createComponent(GrayscaleManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
