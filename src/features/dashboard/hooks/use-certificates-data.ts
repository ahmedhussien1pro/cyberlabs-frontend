// src/features/dashboard/hooks/use-certificates-data.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';

export interface IssuedCertificate {
  id: string;
  verificationId: string;
  issuedAt: string;
  expiresAt?: string | null;
  certificateUrl: string;
  status: 'ACTIVE' | 'REVOKED' | 'EXPIRED';
  course: {
    id: string;
    slug: string;
    title: string;
    ar_title?: string;
    thumbnail?: string;
    difficulty?: string;
  };
}

export const CERTIFICATES_KEY = ['certificates', 'my'] as const;

export function useMyCertificates() {
  return useQuery({
    queryKey: CERTIFICATES_KEY,
    queryFn: async () => {
      const res = await apiClient.get(API_ENDPOINTS.CERTIFICATES.MY);
      const payload = ((res as any)?.data !== undefined
        ? (res as any).data
        : res) as any;
      return (payload?.data ?? payload ?? []) as IssuedCertificate[];
    },
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
}
