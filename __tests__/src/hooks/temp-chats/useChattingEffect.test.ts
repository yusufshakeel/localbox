import { renderHook, act } from '@testing-library/react';
import io from 'socket.io-client';
import useChattingEffect, { MessageBodyType, MessageType } from '@/hooks/temp-chats/useChattingEffect';
import showToast from '@/utils/show-toast';

jest.mock('socket.io-client');
jest.mock('../../../../src/utils/uuid', () => ({ getUUID: jest.fn(() => 'mocked-uuid') }));
jest.mock('../../../../src/utils/show-toast', () => jest.fn());

describe('useChattingEffect', () => {
  let socketMock: any;

  beforeEach(() => {
    socketMock = {
      on: jest.fn(),
      emit: jest.fn(),
      disconnect: jest.fn()
    };
    (io as jest.Mock).mockReturnValue(socketMock);
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should initialize socket and listen to events', () => {
    renderHook(() => useChattingEffect());

    expect(io).toHaveBeenCalledWith({ path: '/api/temp-chats' });
    expect(socketMock.on).toHaveBeenCalledWith('initialMessages', expect.any(Function));
    expect(socketMock.on).toHaveBeenCalledWith('newMessage', expect.any(Function));
    expect(socketMock.on).toHaveBeenCalledWith('error', expect.any(Function));
  });

  it('should update messages when receiving initial messages', () => {
    const { result } = renderHook(() => useChattingEffect());
    const initialMessages: MessageType[] = [{
      id: '1',
      userId: 'user1',
      displayName: 'User One',
      message: 'Hello',
      type: 'text',
      timestamp: Date.now()
    }];

    act(() => {
      socketMock.on.mock.calls.find((call: any) => call[0] === 'initialMessages')[1](initialMessages);
    });

    expect(result.current.messages).toEqual(initialMessages);
  });

  it('should append a new message when receiving newMessage event', () => {
    const { result } = renderHook(() => useChattingEffect());
    const newMessage: MessageType = {
      id: '2',
      userId: 'user2',
      displayName: 'User Two',
      message: 'Hi there!',
      type: 'text',
      timestamp: Date.now()
    };

    act(() => {
      socketMock.on.mock.calls.find((call: any) => call[0] === 'newMessage')[1](newMessage);
    });

    expect(result.current.messages).toContainEqual(newMessage);
  });

  it('should show toast on error event', () => {
    renderHook(() => useChattingEffect());

    act(() => {
      socketMock.on.mock.calls.find((call: any) => call[0] === 'error')[1]({ error: 'Some error' });
    });

    expect(showToast).toHaveBeenCalledWith({
      content: 'Some error',
      type: 'error',
      autoClose: 3000
    });
  });

  it('should send a message with a unique ID', () => {
    const { result } = renderHook(() => useChattingEffect());
    const messageBody: MessageBodyType = {
      userId: 'user1',
      displayName: 'User One',
      message: 'Hello!',
      type: 'text'
    };

    let messageId: string;
    act(() => {
      messageId = result.current.sendMessage(messageBody);
    });

    expect(messageId!).toBe('mocked-uuid');
    expect(socketMock.emit).toHaveBeenCalledWith('sendMessage', expect.objectContaining({
      id: 'mocked-uuid',
      timestamp: expect.any(Number),
      ...messageBody
    }));
  });

  it('should disconnect socket on unmount', () => {
    const { unmount } = renderHook(() => useChattingEffect());
    unmount();
    expect(socketMock.disconnect).toHaveBeenCalled();
  });
});