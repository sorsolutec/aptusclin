import React from 'react';
import Image from 'next/image';

interface DashboardProps {
  slug: string;
  title: string;
  imageUrl?: string;
}

export default function CompanyDashboard({ slug, title, imageUrl }: DashboardProps) {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900 capitalize">{title}</h2>
      <div className="relative h-64 w-full bg-gray-200 rounded-lg overflow-hidden shadow">
        {imageUrl ? (
          <Image src={imageUrl} alt={`${title} photo`} fill className="object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">Placeholder image</div>
        )}
      </div>
      {/* Future widgets can be added here */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded shadow">Widget 1 (coming soon)</div>
        <div className="p-4 bg-white rounded shadow">Widget 2 (coming soon)</div>
      </div>
    </section>
  );
}
