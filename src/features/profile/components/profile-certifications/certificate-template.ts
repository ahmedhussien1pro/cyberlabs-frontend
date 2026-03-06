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
  COURSE: { en: 'Course', ar: 'كورس' },
  PATH: { en: 'Learning Path', ar: 'مسار تعليمي' },
  LAB: { en: 'Lab', ar: 'مختبر' },
  CUSTOM: { en: 'Achievement', ar: 'إنجاز' },
};

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
  const dir = isAr ? 'rtl' : 'ltr';

  const dateStr = completedAt
    ? new Date(completedAt).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : isAr
      ? '—'
      : '—';

  const typeLabels = TYPE_LABELS[certType] ?? TYPE_LABELS.CUSTOM;
  const typeLabel = isAr ? typeLabels.ar : typeLabels.en;

  const completedTxt = isAr
    ? `أتمّ بنجاح ${certType === 'COURSE' ? 'الكورس' : certType === 'PATH' ? 'المسار التعليمي' : certType === 'LAB' ? 'المختبر' : 'الإنجاز'}:`
    : `has successfully completed the ${typeLabel.toLowerCase()}:`;

  return `<!DOCTYPE html>
<html lang="${isAr ? 'ar' : 'en'}" dir="${dir}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Certificate — ${recipientName}</title>
<style>
  @page { size: A4 landscape; margin: 0; }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body {
    width: 297mm; height: 210mm; overflow: hidden;
    font-family: Georgia, 'Times New Roman', serif;
    background: #fff; color: #111827;
    display: flex; align-items: center; justify-content: center;
  }
  .cert {
    width: 100%; height: 100%; position: relative;
    border: 3px solid #0f766e;
    background: linear-gradient(145deg, #f0fdf4 0%, #fff 48%, #f0fdf4 100%);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 26px 52px; gap: 0;
  }
  .inner-border {
    position: absolute; inset: 9px;
    border: 1px solid rgba(15,118,110,.24);
    pointer-events: none;
  }
  /* corners */
  .c { position: absolute; width: 44px; height: 44px; }
  .c.tl { top: 0; left: 0;
    border-top: 5px solid #d97706; border-left: 5px solid #d97706; }
  .c.tr { top: 0; right: 0;
    border-top: 5px solid #d97706; border-right: 5px solid #d97706; }
  .c.bl { bottom: 0; left: 0;
    border-bottom: 5px solid #d97706; border-left: 5px solid #d97706; }
  .c.br { bottom: 0; right: 0;
    border-bottom: 5px solid #d97706; border-right: 5px solid #d97706; }
  /* watermark */
  .wm {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    font-family: Arial, sans-serif; font-size: 90px; font-weight: 900;
    color: rgba(15,118,110,.032); letter-spacing: .22em;
    text-transform: uppercase; transform: rotate(-22deg);
    pointer-events: none; white-space: nowrap; user-select: none;
  }
  /* header */
  .brand {
    font-family: Arial, sans-serif; font-size: 18px; font-weight: 900;
    color: #0f766e; letter-spacing: .3em; text-transform: uppercase;
    margin-bottom: 1px;
  }
  .academy {
    font-family: Arial, sans-serif; font-size: 9.5px; color: #6b7280;
    letter-spacing: .38em; text-transform: uppercase; margin-bottom: 10px;
  }
  .divider {
    width: 96px; height: 2px; margin-bottom: 12px;
    background: linear-gradient(90deg, transparent, #d97706, transparent);
  }
  .cert-title {
    font-size: 23px; font-weight: 400; color: #111827;
    letter-spacing: .1em; text-transform: uppercase; margin-bottom: 3px;
  }
  .certifies {
    font-family: Arial, sans-serif; font-size: 10.5px; color: #9ca3af;
    letter-spacing: .18em; text-transform: uppercase; margin-bottom: 10px;
  }
  /* name */
  .name-wrap {
    border-bottom: 2px solid #0f766e;
    padding: 0 52px 5px; margin-bottom: 10px;
  }
  .name {
    font-size: 30px; font-style: italic; color: #0f766e;
    letter-spacing: .04em; text-align: center;
  }
  /* course info */
  .completed-txt {
    font-family: Arial, sans-serif; font-size: 10.5px; color: #374151;
    margin-bottom: 5px; text-align: center;
  }
  .course-name {
    font-size: 17px; font-weight: 700; color: #111827;
    text-align: center; margin-bottom: 2px;
  }
  .type-label {
    font-family: Arial, sans-serif; font-size: 9.5px; color: #9ca3af;
    letter-spacing: .22em; text-transform: uppercase; margin-bottom: 14px;
  }
  /* footer */
  .footer {
    display: flex; justify-content: space-between; align-items: flex-end;
    width: 100%; padding: 0 6px;
  }
  .sig-line { width: 148px; height: 1px; background: #374151; margin-bottom: 4px; }
  .sig-name  { font-family: Arial, sans-serif; font-size: 11px; font-weight: 700; color: #1f2937; }
  .sig-label { font-family: Arial, sans-serif; font-size: 9px; color: #9ca3af; }
  .right-block { text-align: ${isAr ? 'left' : 'right'}; }
  .date-label { font-family: Arial, sans-serif; font-size: 9px; color: #9ca3af; }
  .date-val   { font-family: Arial, sans-serif; font-size: 11px; font-weight: 600; color: #374151; margin-bottom: 4px; }
  .cert-id    { font-family: 'Courier New', monospace; font-size: 8px; color: #d1d5db; }
  .verified   {
    display: inline-block;
    background: #d1fae5; border: 1px solid #0f766e; border-radius: 999px;
    padding: 2px 10px; margin-top: 3px;
    font-family: Arial, sans-serif; font-size: 8px; color: #0f766e;
    letter-spacing: .1em; text-transform: uppercase;
  }
</style>
</head>
<body>
<div class="cert">
  <div class="inner-border"></div>
  <div class="c tl"></div><div class="c tr"></div>
  <div class="c bl"></div><div class="c br"></div>
  <div class="wm">CYBERLABS</div>

  <div class="brand">CyberLabs</div>
  <div class="academy">Academy</div>
  <div class="divider"></div>

  <div class="cert-title">${isAr ? 'شهادة إتمام' : 'Certificate of Completion'}</div>
  <div class="certifies">${isAr ? 'يشهد بأنّ' : 'This is to certify that'}</div>

  <div class="name-wrap">
    <div class="name">${recipientName}</div>
  </div>

  <div class="completed-txt">${completedTxt}</div>
  <div class="course-name">${title}</div>
  <div class="type-label">${typeLabel}</div>

  <div class="footer">
    <div>
      <div class="sig-line"></div>
      <div class="sig-name">CyberLabs Academy</div>
      <div class="sig-label">${isAr ? 'التوقيع المعتمد' : 'Authorized Signature'}</div>
    </div>
    <div class="right-block">
      <div class="date-label">${isAr ? 'تاريخ الإتمام' : 'Date of Completion'}</div>
      <div class="date-val">${dateStr}</div>
      <div class="cert-id">ID: ${certId || 'N/A'}</div>
      <div class="verified">&#10003; ${isAr ? 'موثّق' : 'Verified'}</div>
    </div>
  </div>
</div>
</body>
</html>`;
}

/** يفتح نافذة جديدة ويطبع الشهادة مباشرة (Save as PDF) */
export function openCertPrint(
  data: CertificateData,
  lang: 'en' | 'ar' = 'en',
): void {
  const html = generateCertPrintHTML({ ...data, language: lang });
  const win = window.open('', '_blank', 'width=1140,height=820');
  if (!win) {
    alert(
      lang === 'ar'
        ? 'يرجى السماح للنوافذ المنبثقة لتنزيل الشهادة.'
        : 'Please allow popups to download the certificate.',
    );
    return;
  }
  win.document.write(html);
  win.document.close();
  setTimeout(() => {
    win.focus();
    win.print();
  }, 500);
}
