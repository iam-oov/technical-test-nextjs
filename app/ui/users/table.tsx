import Image from 'next/image';
import Link from 'next/link';
import { fetchFilteredUsers } from '@/app/lib/data';
import Pagination from '@/app/ui/users/pagination';
import { ExpandUser, ViewUserDetails } from '@/app/ui/users/buttons';
import { IUser } from '../../lib/interfaces/user.interface';

export default async function UsersTable({
  query,
  limit,
  currentPage,
  sortBy,
  sortOrder,
  expandedId = '',
}: {
  query: string;
  limit: number;
  currentPage: number;
  sortBy?: keyof IUser;
  sortOrder?: 'asc' | 'desc' | '';
  expandedId?: string;
}) {
  const getNextSortOrder = (col: keyof IUser) => {
    if (sortBy !== col) return 'asc';
    if (sortOrder === 'asc') return 'desc';
    if (sortOrder === 'desc') return '';
    return 'asc';
  };

  const getSortLink = (col: keyof IUser) => {
    const nextOrder = getNextSortOrder(col);
    const params = new URLSearchParams({ query, page: String(currentPage), limit: String(limit) });
    if (nextOrder) {
      params.set('sortBy', col);
      params.set('sortOrder', nextOrder);
    }
    return `?${params.toString()}`;
  };

  const getSortIndicator = (col: string) => {
    if (sortBy !== col) return null;
    if (sortOrder === 'asc') return ' ▲';
    if (sortOrder === 'desc') return ' ▼';
    return null;
  };

  const validSortOrder = sortOrder === '' ? undefined : sortOrder;
  const { users, totalPages } = await fetchFilteredUsers(query, limit, currentPage, sortBy, validSortOrder);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* Mobile view */}
          <div className="md:hidden">
            {users?.map((user) => (
              <div
                key={user.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <Image
                        src={user.image_url}
                        className="mr-2 rounded-full"
                        width={28}
                        height={28}
                        alt={`${user.name}'s profile picture`}
                      />
                      <p>{user.name}</p>
                      <div className="ml-2">
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-sm text-black-500">Phone: {user.phone || 'N/A'}</p>
                    <p className="text-sm text-gray-500">City: {user.city || 'N/A'}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <ExpandUser id={user.id} />
                  </div>
                </div>
                {expandedId === user.id && (
                  <div className="mt-2 rounded bg-gray-100 p-2 text-xs text-gray-700">
                    <strong>ID:</strong> {user.id}
                    <br />
                    <strong>Location:</strong> {user.location.street}, {user.location.city}, {user.location.state}, {user.location.country}, {user.location.postcode}
                    <br />
                    <strong>Coordinates:</strong> {user.location.coordinates.latitude}, {user.location.coordinates.longitude}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop view */}
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  <Link href={getSortLink('name')} scroll={false} className="hover:underline">
                    Name{getSortIndicator('name')}
                  </Link>
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  <Link href={getSortLink('email')} scroll={false} className="hover:underline">
                    Email{getSortIndicator('email')}
                  </Link>
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  <Link href={getSortLink('phone')} scroll={false} className="hover:underline">
                    Phone{getSortIndicator('phone')}
                  </Link>
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  <Link href={getSortLink('city')} scroll={false} className="hover:underline">
                    City{getSortIndicator('city')}
                  </Link>
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {users?.map((user) => [
                <tr
                  key={user.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={user.image_url}
                        className="rounded-full"
                        width={28}
                        height={28}
                        alt={`${user.name}'s profile picture`}
                      />
                      <p>{user.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {user.email}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {user.phone}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {user.city}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <ExpandUser id={user.id} />
                      <ViewUserDetails id={user.id} page={currentPage} limit={limit} />
                    </div>
                  </td>
                </tr>,
                expandedId === user.id && (
                  <tr key={user.id + '-expanded'}>
                    <td colSpan={5} className="bg-gray-100 px-6 py-2 text-xs text-gray-700">
                      <strong>ID:</strong> {user.id}
                      <br />
                      <strong>Location:</strong> {user.location.street}, {user.location.city}, {user.location.state}, {user.location.country}, {user.location.postcode}
                      <br />
                      <strong>Coordinates:</strong> {user.location.coordinates.latitude}, {user.location.coordinates.longitude}
                    </td>
                  </tr>
                )
              ])}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="mt-5 flex w-full justify-center">
            <Pagination totalPages={totalPages} />
          </div>
        </div>
      </div>
    </div>
  );
}
