'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clearToken } from '@/lib/auth';

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();

  function logout() {
    clearToken();
    router.push('/login');
  }

  const link = (href: string, label: string) => (
    <Link
      href={href}
      className={`rounded-full px-4 py-1.5 text-sm font-medium ${
        pathname === href ? 'bg-amber-500 text-white' : 'text-stone-600 hover:bg-amber-100'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
      <div className="flex items-center gap-2">
        <span className="text-xl">🫙</span>
        {link('/', 'Jar')}
        {link('/wins', 'History')}
      </div>
      <button onClick={logout} className="text-sm text-stone-500 hover:text-stone-800">
        Log out
      </button>
    </nav>
  );
}
