import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from './api/auth/[...nextauth]/route';
import './globals.css';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/menu');
  } else {
    redirect('/login');
  }
}
