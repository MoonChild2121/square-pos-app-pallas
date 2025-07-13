import { Suspense } from 'react' 
import { MenuDashboard } from '@/containers/menu/MenuDashboard'
import { fetchCatalog } from '@/hooks/useCatalog'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation' //Next.js App Router utility that performs server-side redirects

// Configure route segment
export const revalidate = 300 // revalidate every 5 minutes

async function getInitialData() {
  const session = await getServerSession(authOptions)
  
  if (!session?.accessToken) {
    redirect('/api/auth/signin')
  }

  const data = await fetchCatalog(session.accessToken)

  return {
    catalog: data.items,
    images: data.images
  }
}

export default async function MenuPage() {
  const initialData = await getInitialData()

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MenuDashboard initialData={initialData} />
    </Suspense>
  )
} 