'use client';
import { SignOutButton } from '@clerk/nextjs';
import Link from 'next/link';

function SignOutLink() {
  const handleLogout = () => {
  };
  return (
    <SignOutButton>
      <Link href='/' className='w-full text-left' onClick={handleLogout}>
        Logout
      </Link>
    </SignOutButton>
  );
}
export default SignOutLink;