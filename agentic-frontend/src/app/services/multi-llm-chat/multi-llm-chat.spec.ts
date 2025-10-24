import { TestBed } from '@angular/core/testing';

import { MultiLlmChat } from './multi-llm-chat';

describe('MultiLlmChat', () => {
  let service: MultiLlmChat;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MultiLlmChat);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
