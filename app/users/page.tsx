import { Suspense } from 'react';
import { Metadata } from 'next';

import { inter } from '@/app/ui/fonts';
import { UsersTableSkeleton } from '@/app/ui/skeletons';
import Search from '@/app/ui/search';
import UsersTable from '@/app/ui/users/table';

export const metadata: Metadata = {
  title: 'Users',
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    limit?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const limit = Number(searchParams?.limit) || 10;

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${inter.className} text-2xl`}>Users</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search users..." />
      </div>
      <Suspense key={query + currentPage} fallback={<UsersTableSkeleton />}>
        <UsersTable query={query} limit={limit} currentPage={currentPage} />
      </Suspense>
    </div>
  );
}