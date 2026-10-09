import './globals.css';
import CustomCursor from '@/components/CustomCursor';
import ToastProvider from '@/components/ToastProvider';

export const metadata = {
  title: 'Avishka Bambaradeniya — Visual Designer & Content Creator',
  description: 'Portfolio website',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <CustomCursor />
        <main style={{ position: 'relative', zIndex: 1 }}>{children}</main>
        <ToastProvider />
      </body>
    </html>
  );
}

