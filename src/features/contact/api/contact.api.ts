import { apiClient } from '@/core/api/client';

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const sendContactMessage = (payload: ContactPayload) =>
  apiClient.post('/contact', payload);
