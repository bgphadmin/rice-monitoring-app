import UserList from '@/components/user/UserList'
import SkeletonTable from '@/components/utils/SkeletonTable'
import { getUsers } from '@/utils/actions';
import React, { Suspense } from 'react'
import { redirect } from 'next/navigation';
import verifyUser from '@/utils/userValidation';

const UsersPage = async () => {
  const isSuperuser = await verifyUser("SUPERUSER");
  if (!isSuperuser) return redirect('/');

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
