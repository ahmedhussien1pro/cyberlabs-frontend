// src/features/dashboard/pages/verify-certificate-page.tsx
import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient, API_ENDPOINTS } from '@/core/api';
import {
  Shield,
  CheckCircle2,
  XCircle,
  Download,
  Share2,
  Linkedin,
  Twitter,
  Calendar,
  BookOpen,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';

interface VerifyResult {
  valid: boolean;
  status: 'ACTIVE' | 'REVOKED' | 'EXPIRED';
  user: { name: string; email: string; avatarUrl?: string };
  course: { title: string; ar_title?: string; imageUrl?: string };
  issuedAt: string;
  expiresAt?: string;
  verificationId: string;
}

export default function VerifyCertificatePage() {
  const { verificationId } = useParams<{ verificationId: string }>();
  const [data, setData] = useState<VerifyResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  const shareUrl = `${window.location.origin}/verify/${verificationId}`;

  useEffect(() => {
    if (!verificationId) return;
    setLoading(true);
    apiClient
      .get<VerifyResult>(API_ENDPOINTS.CERTIFICATES.VERIFY(verificationId))
      .then((res) => setData(res.data))
      .catch(() => setError('Certificate not found or invalid.'))
      .finally(() => setLoading(false));
  }, [verificationId]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`I just earned a certificate from CyberLabs! \ud83c\udfc6 #CyberSecurity #CyberLabs`)}&url=${encodeURIComponent(shareUrl)}`;

  if (loading) {
    return (
      <div className='min-h-screen bg-[#0a0e1a] flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4' />
          <p className='text-slate-400 text-lg'>Verifying certificate...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className='min-h-screen bg-[#0a0e1a] flex items-center justify-center p-6'>
        <div className='bg-[#111827] border border-red-500/30 rounded-2xl p-10 text-center max-w-md'>
          <XCircle className='w-16 h-16 text-red-500 mx-auto mb-4' />
          <h1 className='text-2xl font-bold text-white mb-2'>
            Certificate Not Found
          </h1>
          <p className='text-slate-400 mb-6'>
            {error ?? 'This certificate ID does not exist or has been revoked.'}
          </p>
          <Link
            to='/'
            className='inline-block px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium transition-colors'>
            Go to CyberLabs
          </Link>
        </div>
      </div>
    );
  }

  const isValid = data.valid && data.status === 'ACTIVE';
  const issuedDate = new Date(data.issuedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className='min-h-screen bg-[#0a0e1a] p-4 md:p-8'>
      {/* Header */}
      <div className='max-w-4xl mx-auto mb-8 flex items-center justify-between'>
        <Link
          to='/'
          className='flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors'>
          <Shield className='w-6 h-6' />
          <span className='font-bold text-lg'>CyberLabs</span>
        </Link>
        <span className='text-slate-500 text-sm'>Certificate Verification</span>
      </div>

      <div className='max-w-4xl mx-auto'>
        {/* Status Badge */}
        <div className='text-center mb-8'>
          {isValid ? (
            <div className='inline-flex items-center gap-3 bg-green-500/10 border border-green-500/30 text-green-400 px-6 py-3 rounded-full text-lg font-semibold'>
              <CheckCircle2 className='w-6 h-6' />
              This certificate is valid and authentic
            </div>
          ) : (
            <div className='inline-flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 px-6 py-3 rounded-full text-lg font-semibold'>
              <XCircle className='w-6 h-6' />
              Certificate {data.status.toLowerCase()}
            </div>
          )}
        </div>

        {/* Certificate Card */}
        <div
          ref={certRef}
          className='bg-gradient-to-br from-[#0d1526] via-[#111827] to-[#0d1526] border border-cyan-500/20 rounded-3xl p-8 md:p-12 shadow-2xl shadow-cyan-500/5 relative overflow-hidden print:shadow-none'>
          {/* Decorative corners */}
          <div className='absolute top-0 left-0 w-32 h-32 bg-cyan-500/5 rounded-full -translate-x-16 -translate-y-16' />
          <div className='absolute bottom-0 right-0 w-48 h-48 bg-purple-500/5 rounded-full translate-x-24 translate-y-24' />

          {/* Top section */}
          <div className='relative text-center mb-10'>
            <div className='inline-flex items-center justify-center w-20 h-20 bg-cyan-500/10 border-2 border-cyan-500/30 rounded-2xl mb-4'>
              <Shield className='w-10 h-10 text-cyan-400' />
            </div>
            <p className='text-cyan-400 text-sm font-semibold uppercase tracking-[0.2em] mb-2'>
              Certificate of Completion
            </p>
            <h1 className='text-4xl md:text-5xl font-bold text-white mb-1'>
              {data.course.title}
            </h1>
            {data.course.ar_title && (
              <p className='text-slate-400 text-lg mt-1 font-arabic'>
                {data.course.ar_title}
              </p>
            )}
          </div>

          {/* Divider */}
          <div className='relative flex items-center gap-4 my-8'>
            <div className='flex-1 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent' />
            <div className='w-2 h-2 bg-cyan-500 rounded-full' />
            <div className='flex-1 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent' />
          </div>

          {/* This certifies */}
          <div className='relative text-center mb-10'>
            <p className='text-slate-400 text-base mb-3'>This certifies that</p>
            <div className='flex items-center justify-center gap-3'>
              {data.user.avatarUrl && (
                <img
                  src={data.user.avatarUrl}
                  alt={data.user.name}
                  className='w-12 h-12 rounded-full border-2 border-cyan-500/40'
                />
              )}
              <div>
                <h2 className='text-3xl font-bold text-white'>
                  {data.user.name}
                </h2>
                <p className='text-slate-400 text-sm'>{data.user.email}</p>
              </div>
            </div>
            <p className='text-slate-400 text-base mt-4'>
              has successfully completed the course with distinction
            </p>
          </div>

          {/* Meta row */}
          <div className='relative grid grid-cols-1 md:grid-cols-3 gap-4 mb-10'>
            <div className='bg-white/5 rounded-xl p-4 text-center'>
              <Calendar className='w-5 h-5 text-cyan-400 mx-auto mb-2' />
              <p className='text-slate-400 text-xs uppercase tracking-wider mb-1'>
                Issued On
              </p>
              <p className='text-white font-semibold text-sm'>{issuedDate}</p>
            </div>
            <div className='bg-white/5 rounded-xl p-4 text-center'>
              <BookOpen className='w-5 h-5 text-cyan-400 mx-auto mb-2' />
              <p className='text-slate-400 text-xs uppercase tracking-wider mb-1'>
                Course
              </p>
              <p className='text-white font-semibold text-sm truncate'>
                {data.course.title}
              </p>
            </div>
            <div className='bg-white/5 rounded-xl p-4 text-center'>
              <Shield className='w-5 h-5 text-cyan-400 mx-auto mb-2' />
              <p className='text-slate-400 text-xs uppercase tracking-wider mb-1'>
                Status
              </p>
              <p
                className={`font-semibold text-sm ${isValid ? 'text-green-400' : 'text-red-400'}`}>
                {data.status}
              </p>
            </div>
          </div>

          {/* Verification ID */}
          <div className='relative border border-white/10 rounded-xl p-4 bg-white/5'>
            <p className='text-slate-400 text-xs uppercase tracking-wider mb-2'>
              Verification ID
            </p>
            <div className='flex items-center justify-between gap-3'>
              <code className='text-cyan-300 font-mono text-sm break-all'>
                {data.verificationId}
              </code>
              <button
                onClick={handleCopy}
                className='shrink-0 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors'
                title='Copy verification link'>
                {copied ? (
                  <Check className='w-4 h-4 text-green-400' />
                ) : (
                  <Copy className='w-4 h-4' />
                )}
              </button>
            </div>
          </div>

          {/* Issued by */}
          <div className='relative text-center mt-8'>
            <p className='text-slate-500 text-xs'>
              Issued by{' '}
              <Link to='/' className='text-cyan-400 hover:underline'>
                CyberLabs Platform
              </Link>{' '}
              — Cybersecurity Training & Certification
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='mt-8 flex flex-wrap items-center justify-center gap-3'>
          <button
            onClick={handleCopy}
            className='inline-flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors border border-white/10'>
            {copied ? (
              <Check className='w-4 h-4 text-green-400' />
            ) : (
              <Share2 className='w-4 h-4' />
            )}
            {copied ? 'Link Copied!' : 'Copy Link'}
          </button>

          <a
            href={linkedinShareUrl}
            target='_blank'
            rel='noreferrer'
            className='inline-flex items-center gap-2 px-5 py-3 bg-[#0A66C2] hover:bg-[#0958a8] text-white rounded-xl font-medium transition-colors'>
            <Linkedin className='w-4 h-4' />
            Share on LinkedIn
          </a>

          <a
            href={twitterShareUrl}
            target='_blank'
            rel='noreferrer'
            className='inline-flex items-center gap-2 px-5 py-3 bg-[#1DA1F2] hover:bg-[#1a91db] text-white rounded-xl font-medium transition-colors'>
            <Twitter className='w-4 h-4' />
            Share on X
          </a>

          <button
            onClick={handlePrint}
            className='inline-flex items-center gap-2 px-5 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-medium transition-colors'>
            <Download className='w-4 h-4' />
            Download / Print
          </button>

          <Link
            to='/'
            className='inline-flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl font-medium transition-colors border border-white/10'>
            <ExternalLink className='w-4 h-4' />
            Go to CyberLabs
          </Link>
        </div>

        {/* Footer note */}
        <p className='text-center text-slate-600 text-xs mt-8'>
          You can verify the authenticity of this certificate at{' '}
          <span className='text-cyan-600'>{shareUrl}</span>
        </p>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body { background: white !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          button, a:not(.cert-link) { display: none !important; }
        }
      `}</style>
    </div>
  );
}
