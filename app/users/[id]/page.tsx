import { notFound } from 'next/navigation';
import { Metadata } from 'next';

import Breadcrumbs from '@/app/ui/users/breadcrumbs';
import TemplateUserDetails from '@/app/ui/users/template-user-details';
import { fetchUserById } from '@/app/lib/data';

export const metadata: Metadata = {
  title: 'User Details',
};

export default async function Page(props: { params: Promise<{ id: string }>, searchParams?: Promise<{ page?: string; limit?: string }> }) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const id = params.id;
  const page = Number(searchParams?.page) || 1;
  const limit = Number(searchParams?.limit) || 10;

  const [user] = await Promise.all([
    fetchUserById(id, page, limit),
  ]);

  if (!user) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Users', href: '/users' },
          {
            label: 'View User Details',
            href: `/users/${id}`,
            active: true,
          },
        ]}
      />

      <TemplateUserDetails
        id={id}
        user={user}
      />
    </main>
  );
}