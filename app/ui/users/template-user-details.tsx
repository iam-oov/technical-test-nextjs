'use client';

import Image from "next/image";

import { IResponse } from "../../lib/interfaces/api-response.interface";

export default function TemplateUserDetails({ id, user }: { id: string; user: IResponse['results'][0] }) {
  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8 mt-10 border border-gray-100">
      <p className="text-sm text-gray-400 mb-6">ID: <span className="font-mono text-gray-500">{id}</span></p>
      <div className="flex flex-col items-center mb-8">
        <Image
          src={user.picture.large}
          alt={`${user.name.first} ${user.name.last}`}
          width={128}
          height={128}
          className="rounded-full w-32 h-32 border-4 border-gray-200 shadow-sm mb-4 object-cover"
          priority
        />
        <p className="text-lg font-semibold text-gray-800">{user.name.first} {user.name.last}</p>
        <p className="text-gray-500 text-sm">{user.email && (
          <a href={`mailto:${user.email}`} className="hover:underline">{user.email}</a>
        )}</p>
      </div>
      <div className="grid grid-cols-1 gap-6">
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-1">Location</h2>
          <div className="text-gray-500 text-sm space-y-1">
            <p>City: <span className="font-medium text-gray-700">{user.location.city}</span></p>
            <p>Country: <span className="font-medium text-gray-700">{user.location.country}</span></p>
            <p>Coordinates: <span className="font-mono">{user.location.coordinates.latitude}, {user.location.coordinates.longitude}</span></p>
            <p>Street: <span className="font-medium text-gray-700">{user.location.street.name}, {user.location.street.number}</span></p>
            <p>Timezone: <span className="font-medium text-gray-700">{user.location.timezone.description || 'N/A'}</span></p>
          </div>
        </section>
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-1">Contact</h2>
          <div className="text-gray-500 text-sm space-y-1">
            <p>Phone: <span className="font-medium text-gray-700">{user.phone || 'N/A'}</span></p>
            <p>Cell: <span className="font-medium text-gray-700">{user.cell || 'N/A'}</span></p>
          </div>
        </section>
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-1">Login</h2>
          <div className="text-gray-500 text-xs space-y-1">
            <p>Username: <span className="font-mono">{user.login.username}</span></p>
            <p>Password: <span className="font-mono">{user.login.password}</span></p>
            <p>Salt: <span className="font-mono">{user.login.salt}</span></p>
            <p>MD5: <span className="font-mono">{user.login.md5}</span></p>
            <p>SHA1: <span className="font-mono">{user.login.sha1}</span></p>
            <p>SHA256: <span className="font-mono">{user.login.sha256}</span></p>
          </div>
        </section>
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-1">Registered</h2>
          <div className="text-gray-500 text-sm space-y-1">
            <p>Date: <span className="font-medium text-gray-700">{new Date(user.registered.date).toLocaleDateString()}</span></p>
            <p>Age: <span className="font-medium text-gray-700">{user.registered.age}</span></p>
          </div>
        </section>
      </div>
    </div>
  );
}

