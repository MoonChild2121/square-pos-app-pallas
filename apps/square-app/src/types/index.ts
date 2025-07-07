export interface Modifier {
  type: string
  id: string
  updated_at: string
  created_at: string
  version: number
  is_deleted: boolean
  present_at_all_locations: boolean
  modifier_data: {
    name: string
    price_money: {
      amount: number
      currency: string
    }
    on_by_default: boolean
    ordinal: number
    modifier_list_id: string
    hidden_online: boolean
  }
}

export interface ModifierList {
  object: {
    type: string
    id: string
    updated_at: string
    created_at: string
    version: number
    is_deleted: boolean
    present_at_all_locations: boolean
    modifier_list_data: {
      name: string
      ordinal: number
      selection_type: string
      modifiers: Modifier[]
      allow_quantities: boolean
      modifier_type: string
      max_length: number
      text_required: boolean
      internal_name: string
    }
  }
}

export interface ItemVariation {
  type: string
  id: string
  updated_at: string
  created_at: string
  version: number
  is_deleted: boolean
  present_at_all_locations: boolean
  item_variation_data: {
    item_id: string
    name: string
    ordinal: number
    pricing_type: string
    price_money: {
      amount: number
      currency: string
    }
    location_overrides: {
      location_id: string
      track_inventory: boolean
    }[]
    track_inventory: boolean
    sellable: boolean,
    stockable: boolean,
    image_ids: string[]
  }
}

export interface ModifierListInfo {
  modifier_list_id: string
  min_selected_modifiers: number
  max_selected_modifiers: number
  enabled: boolean
  hidden_from_customer: boolean
  allow_quantities: string
  is_conversational: string
  hidden_from_customer_override: string
}

export interface CatalogItem {
  type: string
  id: string
  updated_at: string
  created_at: string
  version: number
  is_deleted: boolean
  present_at_all_locations: boolean
  item_data: {
    name: string
    is_taxable: boolean
    tax_ids: string[]
    modifier_list_info?: ModifierListInfo[]
    variations: ItemVariation[]
    product_type: string
    skip_modifier_screen: boolean
    categories: {
      id: string
      ordinal: number
    }[]
    is_archived: boolean
    reporting_category: {
      id: string
      ordinal: number
    }
    is_alcoholic: boolean
    image_ids?: string[]
  }
}

export interface Product {
  id: string
  name: string
  price: {
    amount: number
    currency: string
  }
  imageUrl?: string
  modifierListInfo?: ModifierListInfo[]
}