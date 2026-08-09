import UserList from '@/components/user/UserList'
import SkeletonTable from '@/components/utils/SkeletonTable'
import { getUsers } from '@/utils/actions';
import { auth } from '@clerk/nextjs/server';
import React, { Suspense } from 'react'
import db from '@/utils/db';
import { redirect } from 'next/navigation';

const UsersPage = async () => {

  const { userId } = auth();
  // Look up the local user record by Clerk ID
  const currentUser = await db.user.findUnique({
    where: { clerkId: userId || "" },
  });

  if (!currentUser || currentUser.role !== "SUPERUSER") {
    redirect("/"); // restrict access if not admin
  }

  // get the users list from the database
  const users = await getUsers();

  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-bold text-green-700">Rice Inventory</h2>
      <Suspense fallback={<SkeletonTable />}>
        <UserList users={users} />
      </Suspense>
    </section>
  )
}

export default UsersPage
