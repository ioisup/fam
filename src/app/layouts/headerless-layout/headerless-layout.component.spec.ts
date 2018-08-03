import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderlessLayoutComponent } from './headerless-layout.component';

describe('HeaderlessLayoutComponent', () => {
  let component: HeaderlessLayoutComponent;
  let fixture: ComponentFixture<HeaderlessLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderlessLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderlessLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
