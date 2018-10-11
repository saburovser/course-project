import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VkToolsComponent } from './vk-tools.component';

describe('VkToolsComponent', () => {
  let component: VkToolsComponent;
  let fixture: ComponentFixture<VkToolsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VkToolsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VkToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
