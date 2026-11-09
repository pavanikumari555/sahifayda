'use client';
import { BadgeCheck, Clock, ExternalLink } from 'lucide-react';
import { financeSourceById } from '../lib/finance-knowledge.mjs';

const categoryNames = {
  loan: ['Loan', 'लोन'], savings_account: ['Savings', 'बचत खाता'], demat: ['Demat', 'डीमैट'],
  credit_card: ['Credit card', 'क्रेडिट कार्ड'], insurance: ['Insurance', 'बीमा'], other: ['Payments', 'भुगतान'],
};

// Shows what SIA's scheduled source check actually recorded. Nothing here is invented:
// rows come from finance_knowledge, and an empty or failed read says so plainly.
export default function SiaUpdates({ language, feed }) {
  const hi = language === 'hi';
  const when = new Intl.DateTimeFormat(hi ? 'hi-IN' : 'en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata' });
  const rows = (feed.rows || []).filter(row => financeSourceById[row.id]).sort((a, b) => Date.parse(b.checked_at || 0) - Date.parse(a.checked_at || 0));
  return <div className="hp-updates">
    {feed.state === 'loading' && <p className="hp-updates-empty" role="status">{hi ? 'जाँच की जानकारी लोड हो रही है…' : 'Loading the latest checks…'}</p>}
    {feed.state === 'error' && <p className="hp-updates-empty" role="status">{hi ? 'अभी जाँच की जानकारी नहीं मिल सकी। गाइड और सेवाएँ पहले की तरह उपलब्ध हैं।' : 'The check log could not be loaded right now. Guides and services still work.'}</p>}
    {feed.state === 'ready' && !rows.length && <p className="hp-updates-empty" role="status">{hi ? 'अभी कोई जाँच दर्ज नहीं है।' : 'No checks recorded yet.'}</p>}
    {rows.length > 0 && <ul>
      {rows.map(row => {
        const source = financeSourceById[row.id], verified = row.status === 'verified', checked = Date.parse(row.checked_at);
        return <li key={row.id}>
          <span className={verified ? 'hp-update-state ok' : 'hp-update-state due'}>{verified ? <BadgeCheck size={16} aria-hidden="true"/> : <Clock size={16} aria-hidden="true"/>}{verified ? (hi ? 'जाँचा गया' : 'Verified') : (hi ? 'समीक्षा बाकी' : 'Review due')}</span>
          <strong>{source.name}</strong>
          <small>{(categoryNames[source.category] || categoryNames.other)[hi ? 1 : 0]} · {Number.isFinite(checked) ? when.format(new Date(checked)) : (hi ? 'तारीख़ उपलब्ध नहीं' : 'date unavailable')}</small>
          <a href={source.url} target="_blank" rel="noopener noreferrer">{hi ? 'आधिकारिक पेज' : 'Official page'}<ExternalLink size={13} aria-hidden="true"/><span className="hp-sr">{hi ? ' (नई टैब में खुलता है)' : ' (opens in a new tab)'}</span></a>
        </li>;
      })}
    </ul>}
  </div>;
}
