import './globals.css';
export const metadata = {
  title: 'SahiFayda — Make your everyday money make sense',
  description: 'Understand your monthly budget, compare purchase quotes and find practical payment guidance. In English and Hindi.',
  robots: { index: false, follow: false },
};
export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
