import { Suspense } from 'react' 
import { MenuDashboard } from '@/containers/menu/MenuDashboard'
import { fetchCatalog } from '@/shared/hooks/useCatalog'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import { REVALIDATE_INTERVAL } from '@/shared/constants'

// Configure route segment
export const revalidate = REVALIDATE_INTERVAL // revalidate every 5 minutes

async function getInitialData() {
  const session = await getServerSession(authOptions)
  
  if (!session?.accessToken) {
    redirect('/api/auth/signin')
  }

  const data = await fetchCatalog(session.accessToken)

  return {
    catalog: data.items,
    taxes: data.taxes,
    discounts: data.discounts,
    images: data.images,
    modifiers: data.modifiers
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