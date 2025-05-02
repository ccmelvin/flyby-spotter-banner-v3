'use client';

import Link from 'next/link';

export default function BannerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {children}
      <div className="fixed bottom-4 right-4 flex gap-2">
        <Link href="/banner-top" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Top Banner
        </Link>
        <Link href="/banner-bottom" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
          Bottom Banner
        </Link>
        <Link href="/landing-alert" className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
          Landing Alert
        </Link>
      </div>
    </div>
  );
}
