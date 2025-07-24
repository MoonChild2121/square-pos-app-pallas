'use client';


export default function ProtectedLayout({ children }: { children: React.ReactNode }) {

  return (
      <div className="min-h-screen">
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
  );
}
