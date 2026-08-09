import { currentUser } from '@clerk/nextjs/server';
import { LuUser } from 'react-icons/lu';
import React from 'react'
import Image from 'next/image';

async function UserIcon() {
  const user = await currentUser();
  const profileImage = user?.imageUrl;
  if (profileImage)
    return (
      <Image src={profileImage} className='w-6 h-6 rounded-full object-cover' width={24} height={24} alt='profile' />
    );
  return <LuUser className='w-6 h-6 bg-primary rounded-full text-white' />;
}

export default UserIcon
