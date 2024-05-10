import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfScrollComponent } from './pdf-scroll.component';

describe('PdfScrollComponent', () => {
  let component: PdfScrollComponent;
  let fixture: ComponentFixture<PdfScrollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdfScrollComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PdfScrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
