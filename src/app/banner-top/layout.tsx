'use client';


export default function BannerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col ">
      {children}
    </div>
  );
}
