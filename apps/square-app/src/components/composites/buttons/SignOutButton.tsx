'use client';

import { Button } from '@/components/primitives/ui/button';
import { signOut } from 'next-auth/react';
import LogOut from 'lucide-react/dist/esm/icons/log-out';

export function SignOutButton() {
  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' });
  };

  return (
    <Button
      variant="primary"
      shape="circle"
      size="icon"
      aria-label="Sign out"
      onClick={handleSignOut}
    >
      <LogOut />
    </Button>
  );
}
