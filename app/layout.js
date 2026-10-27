import './globals.css';
import './redesign.css';
export const metadata = {
  title: 'SahiFayda — Make your everyday money make sense',
  description: 'Understand your monthly budget, compare purchase quotes and find practical payment guidance. In English and Hindi.',
  robots: { index: false, follow: false },
};
export default function RootLayout({ children }) {
  return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:"try{var t=localStorage.getItem('sahifayda-theme');document.documentElement.dataset.theme=t==='dark'?'dark':'light';document.documentElement.style.colorScheme=t==='dark'?'dark':'light'}catch(e){}"}}/></head><body>{children}</body></html>;
}
