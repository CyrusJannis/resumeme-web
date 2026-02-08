import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

export const metadata: Metadata = {
  title: 'ResumeME - AI Resume Builder',
  description: 'Build ATS-optimized resumes with AI. Get interviews faster.',
  keywords: 'resume, AI, ATS-optimized, job search, career',
  openGraph: {
    title: 'ResumeME - AI Resume Builder',
    description: 'Build ATS-optimized resumes with AI. Get interviews faster.',
    type: 'website',
  },
};

const AuthProvider = dynamic(() => import('@/lib/auth/context').then(m => m.AuthProvider), {
  ssr: false,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{
        margin: 0,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        color: '#f8fafc',
        minHeight: '100vh'
      }}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}