import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceFileComponent } from './source-file.component';

describe('SourceFileComponent', () => {
  let component: SourceFileComponent;
  let fixture: ComponentFixture<SourceFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SourceFileComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SourceFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
