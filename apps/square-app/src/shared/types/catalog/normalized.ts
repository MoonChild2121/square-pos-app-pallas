import { CatalogItem, DiscountItem, Modifier, TaxItem } from '.'
import { ModifierData } from '../modifiers'

export interface NormalizedCatalog {
  items: CatalogItem[]
  taxes: TaxItem[]
  discounts: DiscountItem[]
  imageData: Record<string, string>
  modifiers: Modifier[]
  getVariantImageUrl: (variantId: string) => string | undefined
  getItemModifiers: (item: CatalogItem) => ModifierData[]
}