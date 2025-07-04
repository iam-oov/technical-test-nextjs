'use client';

import Link from 'next/link';
import { BookOpenIcon, EyeIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname } from 'next/navigation';

export function ExpandUser({ id }: { id: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams.toString());
  const expanded = params.get('expandedId') === id;

  if (expanded) {
    params.delete('expandedId');
  } else {
    params.set('expandedId', id);
  }
  const href = `${pathname}?${params.toString()}`;

  return (
    <Link
      href={href}
      scroll={false}
      className={`rounded-md border p-2 hover:bg-gray-100 ${expanded ? 'bg-gray-200' : ''}`}
    >
      <EyeIcon className="w-5" />
    </Link>
  );
}

export function ViewUserDetails({ id, page, limit }: { id: string; page: number; limit: number }) {
  return (
    <Link
      href={`/users/${id}?page=${page}&limit=${limit}`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <BookOpenIcon className="w-5" />
    </Link>
  );
}