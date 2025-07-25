import { Suspense } from 'react' 
import { MenuDashboard } from '@/containers/menu/MenuDashboard'
import { getServerSession } from 'next-auth'
import { getCatalogService } from '@/shared/services/service-factory'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'


async function getInitialData() {
  const session = await getServerSession(authOptions)
  
  if (!session?.accessToken) {
    redirect('/api/auth/signin')
  }
  // Get the catalog service  
  const catalogService = getCatalogService()
  // Get the catalog data
  const data = await catalogService.getCatalog(session.accessToken)

  // The service returns the data in the clean `CatalogData` format,
  // which is exactly what the MenuDashboard now expects for its initialData prop.
  return data;
}

export default async function MenuPage() {
  const initialData = await getInitialData()

  return (
    <Suspense >
      <MenuDashboard initialData={initialData} />
    </Suspense>
  )
} 