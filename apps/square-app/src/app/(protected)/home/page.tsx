import { Suspense } from 'react' 
import { HomeContainer } from '@/containers/home/HomeContainer'
import { getServerSession } from 'next-auth'
import { getCatalogService } from '@/shared/services/service-factory'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import { fetchSquareCatalog } from '@/shared/services/catalog/fetch-logic';

// This is the initial data for the menu dashboard
async function getInitialData() {
  const session = await getServerSession(authOptions)
  
  if (!session?.accessToken) {
    redirect('/api/auth/signin')
  }
  // Get the catalog service  
  const catalogService = getCatalogService()
  // Get the catalog data
  const rawData = await fetchSquareCatalog(session.accessToken);
  const squareCatalogService = catalogService as any; // need to cast to any to access private method
  squareCatalogService.initializeMaps(rawData);
  const data = await catalogService.getCatalog(session.accessToken)

  // The service returns the data in the clean `CatalogData` format,
  // which is exactly what the MenuDashboard now expects for its initialData prop.
  return data;
}

export default async function MenuPage() {
  const initialData = await getInitialData()

  return (
    <Suspense >
      <HomeContainer initialData={initialData} />
    </Suspense>
  )
}