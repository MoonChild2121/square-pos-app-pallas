// Import the interface that all catalog services must implement.
// This defines the shape of the contract the rest of the app depends on.
import { ICatalogService } from './catalog/interface';

// Import a specific implementation of the ICatalogService for Square.
import { SquareCatalogService } from './catalog/square-catalog.service';

// In the future, you might import other services here too:
// import { ShopifyCatalogService } from './catalog/shopify-catalog.service';
// import { MockCatalogService } from './catalog/mock-catalog.service';

/**
 * This value determines which provider/implementation to use.
 * In real projects, this could come from an environment variable, 
 * feature flag, or runtime configuration.
 */
const VENDOR = 'SQUARE'; // For now, hardcoded to 'SQUARE'

// Holds the singleton instance of the catalog service.
// This ensures the service is only initialized once (lazy singleton).
let catalogServiceInstance: ICatalogService;

/**
 * Returns a singleton instance of a catalog service that implements
 * the ICatalogService interface, depending on the selected vendor.
 * 
 * This pattern encapsulates the provider logic behind a factory,
 * so the rest of the app does not depend on specific implementations.
 * 
 * @returns An object that implements ICatalogService (e.g., SquareCatalogService)
 */
export function getCatalogService(): ICatalogService {
  // Only initialize the catalog service once.
  if (!catalogServiceInstance) {
    switch (VENDOR) {
      // Use Square's implementation
      case 'SQUARE':
        catalogServiceInstance = new SquareCatalogService();
        break;

      // In future, you could add more providers like Shopify or a mock:
      // case 'SHOPIFY':
      //   catalogServiceInstance = new ShopifyCatalogService();
      //   break;

      // If the vendor is unknown or not supported, throw an error
      default:
        throw new Error(`Unknown vendor: ${VENDOR}`);
    }
  }

  // Return the initialized singleton instance
  return catalogServiceInstance;
}
