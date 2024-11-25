import {
  Inter_Tight,
  IBM_Plex_Mono,
  Libre_Baskerville,
} from 'next/font/google';
import './globals.css';

export const metadata = {
  title: 'ALDENTE©',
  description: 'Cooked in CS? Get Al Dente.',
};

const inter = Inter_Tight({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const ibmMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: '500',
  display: 'swap',
  variable: '--font-mono',
});

const libreBaskerville = Libre_Baskerville({
  subsets: ['latin'],
  weight: '400',
  style: ['italic', 'normal'],
  display: 'swap',
  variable: '--font-italic',
});

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body
        className={`${inter.variable} ${ibmMono.variable} ${libreBaskerville.variable} font-sans antialiased tracking-tight`}
      >
        {children}
      </body>
    </html>
  );
}
