// src/features/profile/components/profile-certifications/certificate-template.ts

export interface CertificateData {
  recipientName: string;
  title: string;
  certType?: string;
  completedAt: string;
  certId: string;
  language?: 'en' | 'ar';
}

const TYPE_LABELS: Record<string, { en: string; ar: string }> = {
  COURSE: { en: 'Course',        ar: 'كورس' },
  PATH:   { en: 'Learning Path', ar: 'مسار تعليمي' },
  LAB:    { en: 'Lab',           ar: 'مختبر' },
  CUSTOM: { en: 'Achievement',   ar: 'إنجاز' },
};

/**
 * Real CyberLabs logo — inlined from public/assets/images/favIcon.svg
 * Color changed to brand teal so it works in print popups (no external URL needed).
 */
const LOGO_SVG = `<svg width="52" height="52" viewBox="0 0 64 64"
  xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
  <g transform="translate(0,64) scale(0.1,-0.1)" fill="#0f766e" stroke="none">
    <path d="M259 565 c-19 -31 -26 -35 -63 -35 -45 0 -66 -13 -66 -41 0 -9 -7 -22 -16 -30
      -13 -11 -15 -31 -12 -111 1 -54 0 -98 -3 -98 -4 0 -12 7 -19 15 -7 9 -15 13 -18 10
      -7 -7 29 -45 43 -45 6 0 17 -11 23 -25 11 -24 10 -25 -18 -25 -17 0 -30 -4 -30 -10
      0 -5 17 -10 39 -10 54 0 68 -20 30 -45 -28 -20 -38 -35 -20 -35 5 0 14 7 21 15
      16 19 49 19 112 -1 42 -14 57 -15 96 -5 89 24 112 24 133 6 10 -10 22 -15 25 -12
      7 7 -35 46 -50 47 -5 0 -3 7 4 15 7 9 29 15 51 15 22 0 39 5 39 10 0 6 -13 10
      -30 10 -28 0 -29 1 -18 25 6 14 17 25 23 25 14 0 50 38 43 45 -3 3 -11 -1 -18 -10
      -7 -8 -15 -15 -19 -15 -3 0 -4 44 -3 98 3 80 1 100 -12 111 -9 8 -16 21 -16 30
      0 28 -21 41 -66 41 -37 0 -44 4 -63 35 -18 31 -25 35 -61 35 -36 0 -43 -4 -61 -35z
      m115 -12 c21 -40 59 -73 103 -88 l38 -13 0 -110 c0 -107 -1 -112 -30 -152
      -34 -48 -104 -93 -112 -72 -7 17 -23 15 -23 -3 0 -8 -4 -15 -10 -15
      -5 0 -10 11 -10 25 0 14 -4 25 -10 25 -5 0 -10 -11 -10 -25 0 -14 -4 -25 -10 -25
      -5 0 -10 7 -10 15 0 18 -16 20 -23 3 -8 -21 -78 24 -112 72 -29 40 -30 45 -30 152
      l0 110 38 13 c44 15 82 48 103 88 12 22 21 27 54 27 33 0 42 -5 54 -27z
      m-178 -58 c-25 -19 -46 -19 -46 0 0 10 10 15 33 15 30 -1 31 -1 13 -15z
      m294 0 c0 -19 -21 -19 -46 0 -18 14 -17 14 14 15 22 0 32 -5 32 -15z"/>
    <path d="M279 425 c-14 -8 -32 -28 -39 -45 -11 -27 -11 -37 3 -66 9 -19 21 -34 27 -34
      5 0 10 -11 10 -24 0 -24 23 -56 40 -56 17 0 40 32 40 56 0 13 5 24 10 24
      6 0 18 15 27 34 14 29 14 39 3 66 -12 30 -55 60 -82 60 -7 -1 -25 -7 -39 -15z
      m91 -25 c28 -28 26 -76 -5 -104 -14 -14 -25 -34 -25 -50 0 -19 -5 -26 -20 -26
      -15 0 -20 7 -20 26 0 16 -11 36 -25 50 -49 45 -20 124 45 124 17 0 39 -9 50 -20z"/>
  </g>
</svg>`;

/** Smaller version of the logo for the footer seal */
const LOGO_SVG_SM = `<svg width="30" height="30" viewBox="0 0 64 64"
  xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
  <g transform="translate(0,64) scale(0.1,-0.1)" fill="#0f766e" stroke="none">
    <path d="M259 565 c-19 -31 -26 -35 -63 -35 -45 0 -66 -13 -66 -41 0 -9 -7 -22 -16 -30
      -13 -11 -15 -31 -12 -111 1 -54 0 -98 -3 -98 -4 0 -12 7 -19 15 -7 9 -15 13 -18 10
      -7 -7 29 -45 43 -45 6 0 17 -11 23 -25 11 -24 10 -25 -18 -25 -17 0 -30 -4 -30 -10
      0 -5 17 -10 39 -10 54 0 68 -20 30 -45 -28 -20 -38 -35 -20 -35 5 0 14 7 21 15
      16 19 49 19 112 -1 42 -14 57 -15 96 -5 89 24 112 24 133 6 10 -10 22 -15 25 -12
      7 7 -35 46 -50 47 -5 0 -3 7 4 15 7 9 29 15 51 15 22 0 39 5 39 10 0 6 -13 10
      -30 10 -28 0 -29 1 -18 25 6 14 17 25 23 25 14 0 50 38 43 45 -3 3 -11 -1 -18 -10
      -7 -8 -15 -15 -19 -15 -3 0 -4 44 -3 98 3 80 1 100 -12 111 -9 8 -16 21 -16 30
      0 28 -21 41 -66 41 -37 0 -44 4 -63 35 -18 31 -25 35 -61 35 -36 0 -43 -4 -61 -35z"/>
    <path d="M279 425 c-14 -8 -32 -28 -39 -45 -11 -27 -11 -37 3 -66 9 -19 21 -34 27 -34
      5 0 10 -11 10 -24 0 -24 23 -56 40 -56 17 0 40 32 40 56 0 13 5 24 10 24
      6 0 18 15 27 34 14 29 14 39 3 66 -12 30 -55 60 -82 60 -7 -1 -25 -7 -39 -15z
      m91 -25 c28 -28 26 -76 -5 -104 -14 -14 -25 -34 -25 -50 0 -19 -5 -26 -20 -26
      -15 0 -20 7 -20 26 0 16 -11 36 -25 50 -49 45 -20 124 45 124 17 0 39 -9 50 -20z"/>
  </g>
</svg>`;

export function generateCertPrintHTML(data: CertificateData): string {
  const {
    recipientName,
    title,
    certType = 'COURSE',
    completedAt,
    certId,
    language = 'en',
  } = data;

  const isAr = language === 'ar';
  const dir  = isAr ? 'rtl' : 'ltr';

  const dateStr = completedAt
    ? new Date(completedAt).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : '—';

  const typeLabels = TYPE_LABELS[certType] ?? TYPE_LABELS.CUSTOM;
  const typeLabel  = isAr ? typeLabels.ar : typeLabels.en;

  // ── PDF filename: Chrome uses <title> as the default Save-as-PDF filename ──
  const safeName  = title.replace(/[<>"&]/g, '');
  const pageTitle = `${safeName} — Certificate — CyberLabs Academy`;

  const completedTxt = isAr
    ? `أتمّ بنجاح ${
        certType === 'COURSE' ? 'الكورس'
        : certType === 'PATH'  ? 'المسار التعليمي'
        : certType === 'LAB'   ? 'المختبر'
        : 'الإنجاز'
      }:`
    : `has successfully completed the ${typeLabel.toLowerCase()}:`;

  return `<!DOCTYPE html>
<html lang="${isAr ? 'ar' : 'en'}" dir="${dir}">
<head>
<meta charset="UTF-8">
<title>${pageTitle}</title>
<style>
  @page { size: A4 landscape; margin: 0; }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body {
    width: 297mm; height: 210mm; overflow: hidden;
    font-family: Georgia, 'Times New Roman', serif;
    background: #ffffff;
    display: flex; align-items: center; justify-content: center;
  }

  /* ── Certificate wrapper ── */
  .cert {
    width: 100%; height: 100%;
    position: relative;
    background:
      radial-gradient(ellipse at 18% 18%, rgba(15,118,110,.05) 0%, transparent 55%),
      radial-gradient(ellipse at 82% 82%, rgba(201,162,39,.05) 0%, transparent 55%),
      #fffefb;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
  }

  /* ── Double gold border ── */
  .frame-out { position: absolute; inset: 10px; border: 2.5px solid #c9a227; pointer-events: none; }
  .frame-in  { position: absolute; inset: 15px; border: 0.5px solid rgba(201,162,39,.3); pointer-events: none; }

  /* ── Corner ornaments ── */
  .co { position: absolute; width: 38px; height: 38px; }
  .co.tl { top: 6px;    left: 6px;    border-top:    4.5px solid #c9a227; border-left:  4.5px solid #c9a227; }
  .co.tr { top: 6px;    right: 6px;   border-top:    4.5px solid #c9a227; border-right: 4.5px solid #c9a227; }
  .co.bl { bottom: 6px; left: 6px;    border-bottom: 4.5px solid #c9a227; border-left:  4.5px solid #c9a227; }
  .co.br { bottom: 6px; right: 6px;   border-bottom: 4.5px solid #c9a227; border-right: 4.5px solid #c9a227; }

  /* ── Subtle inner corner triangles ── */
  .tri { position: absolute; width: 0; height: 0; }
  .tri.tl { top: 10px;    left: 10px;    border-top:   16px solid rgba(15,118,110,.06); border-right: 16px solid transparent; }
  .tri.br { bottom: 10px; right: 10px;   border-bottom: 16px solid rgba(15,118,110,.06); border-left:  16px solid transparent; }

  /* ── Watermark ── */
  .wm {
    position: absolute; inset: 0; z-index: 0;
    display: flex; align-items: center; justify-content: center;
    font-family: Arial, sans-serif; font-size: 84px; font-weight: 900;
    color: rgba(15,118,110,.022); letter-spacing: .24em;
    text-transform: uppercase; transform: rotate(-20deg);
    pointer-events: none; white-space: nowrap; user-select: none;
  }

  /* ── Content ── */
  .content {
    position: relative; z-index: 1;
    display: flex; flex-direction: column; align-items: center;
    width: 100%; padding: 0 66px; gap: 0;
  }

  /* Logo + Brand row */
  .logo-area  { display: flex; align-items: center; gap: 11px; margin-bottom: 7px; }
  .brand-col  { display: flex; flex-direction: column; }
  .brand-nm   { font-family: Arial, sans-serif; font-size: 17px; font-weight: 900; color: #0f766e; letter-spacing: .38em; text-transform: uppercase; line-height: 1; }
  .brand-sub  { font-family: Arial, sans-serif; font-size: 8px; color: #9ca3af; letter-spacing: .3em; text-transform: uppercase; margin-top: 3px; }

  /* Gold ornament divider */
  .orn        { display: flex; align-items: center; gap: 8px; width: 210px; margin-bottom: 9px; }
  .orn-line   { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, #c9a227 50%, transparent); }
  .orn-d      { width: 6px; height: 6px; background: #c9a227; transform: rotate(45deg); flex-shrink: 0; }

  /* Headings */
  .cert-h     { font-size: 21px; font-weight: 400; color: #1a1a2e; letter-spacing: .18em; text-transform: uppercase; margin-bottom: 3px; }
  .certifies  { font-family: Arial, sans-serif; font-size: 10px; color: #9ca3af; letter-spacing: .18em; text-transform: uppercase; margin-bottom: 8px; }

  /* Recipient name */
  .name-wrap  { text-align: center; margin-bottom: 8px; }
  .name       { font-size: 30px; font-style: italic; color: #0f766e; letter-spacing: .03em; line-height: 1.1; }
  .name-line  { width: 55%; height: 1.5px; margin: 4px auto 0; background: linear-gradient(90deg, transparent, rgba(15,118,110,.45) 40%, transparent); }

  /* Course */
  .comp-lbl   { font-family: Arial, sans-serif; font-size: 10px; color: #6b7280; margin-bottom: 3px; text-align: center; }
  .course-nm  { font-size: 15.5px; font-weight: 700; color: #1a1a2e; text-align: center; margin-bottom: 2px; max-width: 490px; line-height: 1.3; }
  .type-lbl   { font-family: Arial, sans-serif; font-size: 8px; color: #c9a227; letter-spacing: .28em; text-transform: uppercase; margin-bottom: 13px; }

  /* ── Footer ── */
  .footer { display: flex; align-items: flex-end; justify-content: space-between; width: 100%; padding: 0 8px; }

  /* Signature */
  .sig       { min-width: 135px; }
  .sig-line  { width: 135px; height: 1px; background: #374151; margin-bottom: 3px; }
  .sig-name  { font-family: Arial, sans-serif; font-size: 10.5px; font-weight: 700; color: #1f2937; }
  .sig-role  { font-family: Arial, sans-serif; font-size: 8px; color: #9ca3af; }

  /* Official seal */
  .seal      { display: flex; flex-direction: column; align-items: center; gap: 2px; }
  .seal-ring {
    width: 48px; height: 48px; border-radius: 50%;
    border: 2px solid #c9a227;
    background: radial-gradient(circle, #fffef5 55%, #fef5d0);
    display: flex; align-items: center; justify-content: center;
  }
  .seal-lbl  { font-family: Arial, sans-serif; font-size: 6.5px; color: #c9a227; letter-spacing: .1em; text-transform: uppercase; }
  .verified  {
    display: inline-flex; align-items: center; gap: 3px;
    background: #d1fae5; border: 1px solid rgba(15,118,110,.45); border-radius: 999px;
    padding: 1.5px 7px; margin-top: 1px;
    font-family: Arial, sans-serif; font-size: 7px; color: #0f766e; letter-spacing: .07em; text-transform: uppercase;
  }

  /* Date / cert-id */
  .date-bl    { text-align: ${isAr ? 'left' : 'right'}; min-width: 135px; }
  .date-lbl   { font-family: Arial, sans-serif; font-size: 7.5px; color: #9ca3af; letter-spacing: .1em; text-transform: uppercase; }
  .date-val   { font-family: Arial, sans-serif; font-size: 10.5px; font-weight: 600; color: #374151; margin-bottom: 4px; }
  .cert-id    { font-family: 'Courier New', monospace; font-size: 7px; color: #d1d5db; }
</style>
</head>
<body>
<div class="cert">

  <div class="frame-out"></div>
  <div class="frame-in"></div>
  <div class="co tl"></div><div class="co tr"></div>
  <div class="co bl"></div><div class="co br"></div>
  <div class="tri tl"></div><div class="tri br"></div>
  <div class="wm">CYBERLABS</div>

  <div class="content">

    <!-- ① Logo + brand name -->
    <div class="logo-area">
      ${LOGO_SVG}
      <div class="brand-col">
        <span class="brand-nm">CyberLabs</span>
        <span class="brand-sub">Academy</span>
      </div>
    </div>

    <!-- ② Gold ornament divider -->
    <div class="orn">
      <div class="orn-line"></div>
      <div class="orn-d"></div>
      <div class="orn-line"></div>
    </div>

    <!-- ③ Certificate heading -->
    <div class="cert-h">${isAr ? 'شهادة إتمام' : 'Certificate of Completion'}</div>
    <div class="certifies">${isAr ? 'يشهد بأنّ' : 'This is to certify that'}</div>

    <!-- ④ Recipient -->
    <div class="name-wrap">
      <div class="name">${recipientName}</div>
      <div class="name-line"></div>
    </div>

    <!-- ⑤ Course -->
    <div class="comp-lbl">${completedTxt}</div>
    <div class="course-nm">${title}</div>
    <div class="type-lbl">— ${typeLabel} —</div>

    <!-- ⑥ Footer -->
    <div class="footer">

      <!-- Signature -->
      <div class="sig">
        <div class="sig-line"></div>
        <div class="sig-name">CyberLabs Academy</div>
        <div class="sig-role">${isAr ? 'التوقيع المعتمد' : 'Authorized Signature'}</div>
      </div>

      <!-- Official seal with logo -->
      <div class="seal">
        <div class="seal-ring">${LOGO_SVG_SM}</div>
        <div class="seal-lbl">${isAr ? 'معتمد' : 'Official'}</div>
        <div class="verified">&#10003; ${isAr ? 'موثّق' : 'Verified'}</div>
      </div>

      <!-- Date + cert ID -->
      <div class="date-bl">
        <div class="date-lbl">${isAr ? 'تاريخ الإتمام' : 'Date of Completion'}</div>
        <div class="date-val">${dateStr}</div>
        <div class="cert-id">ID: ${certId || 'N/A'}</div>
      </div>

    </div>
  </div>
</div>
</body>
</html>`;
}

/**
 * Opens a new window, writes the certificate HTML, then triggers print dialog.
 * Chrome uses document.title as the default PDF filename.
 * @param onPopupBlocked  Called when the browser blocks the popup.
 */
export function openCertPrint(
  data: CertificateData,
  lang: 'en' | 'ar' = 'en',
  onPopupBlocked?: () => void,
): void {
  const html = generateCertPrintHTML({ ...data, language: lang });
  const win  = window.open('', '_blank', 'width=1140,height=820');
  if (!win) {
    onPopupBlocked?.();
    return;
  }
  win.document.write(html);
  win.document.close();
  // Fallback: explicitly set title after write (safety net for some browsers)
  win.document.title = `${data.title} — Certificate — CyberLabs Academy`;
  setTimeout(() => {
    win.focus();
    win.print();
  }, 600);
}
