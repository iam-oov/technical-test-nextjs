import Link from 'next/link';
import { EyeIcon } from '@heroicons/react/24/outline';

export function ExpandUser({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/invoices/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <EyeIcon className="w-5" />
    </Link>
  );
}