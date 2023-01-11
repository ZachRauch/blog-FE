import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBlogpostComponent } from './new-blogpost.component';

describe('NewBlogpostComponent', () => {
  let component: NewBlogpostComponent;
  let fixture: ComponentFixture<NewBlogpostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewBlogpostComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewBlogpostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
