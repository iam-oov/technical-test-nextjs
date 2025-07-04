import { Suspense } from 'react';
import { Metadata } from 'next';

import { inter } from '@/app/ui/fonts';
import { UsersTableSkeleton } from '@/app/ui/skeletons';
import Search from '@/app/ui/search';
import UsersTable from '@/app/ui/users/table';
import { IUser } from '../lib/interfaces/user.interface';

export const metadata: Metadata = {
  title: 'Users',
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc' | '';
    expandedId?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const limit = Number(searchParams?.limit) || 10;

  const isIUsersKey = (key: any): key is keyof IUser =>
    typeof key === 'string' && key in ({} as IUser);

  const sortBy = isIUsersKey(searchParams?.sortBy) ? searchParams?.sortBy : undefined;
  const sortOrder = searchParams?.sortOrder || undefined;
  const expandedId = searchParams?.expandedId || '';

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${inter.className} text-2xl`}>Users</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search users..." />
      </div>
      <Suspense key={query + currentPage + sortBy + sortOrder} fallback={<UsersTableSkeleton />}>
        <UsersTable
          query={query}
          limit={limit}
          currentPage={currentPage}
          sortBy={sortBy}
          sortOrder={sortOrder}
          expandedId={expandedId}
        />
      </Suspense>
    </div>
  );
}