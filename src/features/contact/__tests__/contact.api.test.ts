import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sendContactMessage, type ContactPayload } from '../api/contact.api';

vi.mock('@/core/api/client', () => ({
  apiClient: {
    post: vi.fn(),
  },
}));

import { apiClient } from '@/core/api/client';

const payload: ContactPayload = {
  name: 'Ahmed',
  email: 'ahmed@test.com',
  subject: 'Hello',
  message: 'This is a test message for contact.',
};

describe('sendContactMessage', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls apiClient.post with /contact and payload', async () => {
    vi.mocked(apiClient.post).mockResolvedValueOnce({ data: { ok: true } });
    await sendContactMessage(payload);
    expect(apiClient.post).toHaveBeenCalledWith('/contact', payload);
    expect(apiClient.post).toHaveBeenCalledTimes(1);
  });

  it('returns the api response', async () => {
    const mockResponse = { data: { id: '123' } };
    vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);
    const result = await sendContactMessage(payload);
    expect(result).toEqual(mockResponse);
  });

  it('throws when apiClient.post rejects', async () => {
    vi.mocked(apiClient.post).mockRejectedValueOnce(new Error('Network error'));
    await expect(sendContactMessage(payload)).rejects.toThrow('Network error');
  });

  it('payload interface has required fields', () => {
    const p: ContactPayload = { name: 'x', email: 'x@x.com', subject: 'y', message: 'z' };
    expect(p).toHaveProperty('name');
    expect(p).toHaveProperty('email');
    expect(p).toHaveProperty('subject');
    expect(p).toHaveProperty('message');
  });
});
