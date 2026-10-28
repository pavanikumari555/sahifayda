import './globals.css';
import './redesign.css';
import { siteConfig } from '../lib/site-config.mjs';
export const viewport = {themeColor: '#16664b'};
export const metadata = {
  manifest: '/manifest.webmanifest',
  appleWebApp: {capable: true, title: 'SahiFayda', statusBarStyle: 'default'},
  icons: {apple: '/icons/apple-touch-icon.png'},
  title: 'SahiFayda — Make your everyday money make sense',
  description: 'Understand your monthly budget, compare purchase quotes and find practical payment guidance. In English and Hindi.',
  robots: { index: siteConfig().indexable, follow: true },
};
export default function RootLayout({ children }) {
  return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:"try{var t=localStorage.getItem('sahifayda-theme');document.documentElement.dataset.theme=t==='dark'?'dark':'light';document.documentElement.style.colorScheme=t==='dark'?'dark':'light'}catch(e){}"}}/></head><body>{children}</body></html>;
}
