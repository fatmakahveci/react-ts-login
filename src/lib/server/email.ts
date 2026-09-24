import nodemailer from 'nodemailer';

export async function sendAccountEmail(to: string, url: string, kind: 'verify' | 'reset') {
  if (!process.env.SMTP_HOST || !process.env.MAIL_FROM) throw new Error('Email delivery is not configured');
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    requireTLS: process.env.SMTP_REQUIRE_TLS !== 'false',
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD } : undefined,
    connectionTimeout: 10000,
  });
  await transport.sendMail({
    from: process.env.MAIL_FROM, to,
    subject: kind === 'verify' ? 'Forma — Verify your email / E-postanı doğrula' : 'Forma — Reset your password / Parolanı sıfırla',
    text: `${kind === 'verify' ? 'Verify your email / E-postanı doğrula' : 'Reset your password / Parolanı sıfırla'}\n\n${url}\n\nIf you did not request this, ignore this email.\nBu işlemi sen başlatmadıysan bu e-postayı dikkate alma.`,
  });
}
