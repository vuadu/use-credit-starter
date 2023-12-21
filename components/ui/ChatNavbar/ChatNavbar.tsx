import CreditComponent from '../CreditComponent';
import s from './ChatNavbar.module.css';
import { createServerSupabaseClient } from '@/app/supabase-server';
import Logo from '@/components/icons/Logo';
import SignOutButton from '@/components/ui/Navbar/SignOutButton';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import Link from 'next/link';

interface Props {
  title: string;
}

export default async function Navbar({ title }: Props) {
  const supabase = createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return (
    <nav className={s.root}>
      <a href="#skip" className="sr-only focus:not-sr-only">
        Skip to content
      </a>
      <div className="mx-auto">
        <div className="relative flex flex-row justify-between py-4 align-center md:py-6">
          <div className="flex items-center flex-1">
            <p className="font-medium">{title}</p>
          </div>
          <div className="flex justify-end flex-1 space-x-8">
            {user ? (
              <SignOutButton />
            ) : (
              <Link href="/signin" className={s.link}>
                Sign in
              </Link>
            )}
            <CreditComponent />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
