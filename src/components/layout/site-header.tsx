import Link from 'next/link';
import './site-header.css';
import AccountNavigation from '@/components/layout/account-navigation';

export default function SiteHeader() {
  return (
    <header className="main-header">
      <Link className="brand" href="/" aria-label="Forma home"><span aria-hidden="true" className="brand-mark">f.</span> forma</Link>
      <AccountNavigation />
    </header>
  );
}
