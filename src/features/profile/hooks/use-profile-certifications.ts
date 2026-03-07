// src/features/profile/hooks/use-profile-certifications.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/core/api/client';
import type { UserCertification } from '../types/profile.types';

function extract<T>(res: unknown): T {
  const r = res as Record<string, unknown>;
  return (r?.data !== undefined ? r.data : res) as T;
}

/**
 * Backend returns IssuedCertificate with nested course.
 * Frontend expects UserCertification — this mapper bridges the gap.
 *
 * Backend shape:
 *   { id, issuedAt, expiresAt, certificateUrl, verificationId,
 *     course: { title, ar_title, slug, ... } }
 *
 * Frontend shape:
 *   { id, title, ar_title, issuer, certType, issueDate, expireDate,
 *     credentialId, credentialUrl }
 */
function mapCertificate(raw: Record<string, unknown>): UserCertification {
  const course = raw.course as Record<string, unknown> | undefined;
  return {
    id: raw.id as string,
    title: (course?.title as string) ?? 'CyberLabs Certificate',
    ar_title: course?.ar_title as string | undefined,
    issuer: 'CyberLabs',
    certType: 'COURSE',
    issueDate: raw.issuedAt as string,
    expireDate: (raw.expiresAt as string) || undefined,
    credentialId: raw.verificationId as string | undefined,
    credentialUrl: (raw.certificateUrl as string) || undefined,
  };
}

/**
 * Fetches the authenticated user's earned certificates.
 * Endpoint: GET /certificates/my
 */
export function useProfileCertifications() {
  return useQuery<UserCertification[]>({
    queryKey: ['profile', 'certifications'],
    queryFn: async () => {
      const raw = extract<Record<string, unknown>[]>(
        await apiClient.get('/certificates/my'), // ✅ correct endpoint
      );
      return raw.map(mapCertificate);
    },
    staleTime: 1000 * 60 * 5,
    placeholderData: [],
  });
}
