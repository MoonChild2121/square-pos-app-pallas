import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import './globals.css';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/home');
  } else {
    redirect('/login');
  }
}
