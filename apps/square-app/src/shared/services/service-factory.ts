import { ICatalogService } from './catalog/interface';
import { SquareCatalogService } from './catalog/square-catalog.service';

// This can be controlled by an environment variable or other configuration
const VENDOR = 'SQUARE'; // or 'SHOPIFY', 'MOCK', etc.

let catalogServiceInstance: ICatalogService;

/**
 * Provides a singleton instance of the catalog service based on the
 * configured vendor.
 *
 * @returns An object implementing the ICatalogService interface.
 */
export function getCatalogService(): ICatalogService {
  if (!catalogServiceInstance) {
    switch (VENDOR) {
      case 'SQUARE':
        catalogServiceInstance = new SquareCatalogService();
        break;
      // case 'SHOPIFY':
      //   catalogServiceInstance = new ShopifyCatalogService();
      //   break;
      default:
        throw new Error(`Unknown vendor: ${VENDOR}`);
    }
  }
  return catalogServiceInstance;
}