import type { ReactNode } from 'react';
import { Product } from '@/shared/types/product'

export interface MenuBoxProps {
  label: string;
  count: number;
  icon?: ReactNode;
  isSelected?: boolean;
  onClick?: () => void;
}

export interface MenuItem {
  id: string;
  label: string;
  count: number;
  icon?: ReactNode;
}

export interface MenuBoxGridProps {
  items: MenuItem[];
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
}


export interface MenuLayoutProps {
  menuItems: MenuItem[];
  selectedItem: string;
  onSelectItem: (id: string) => void;
  onSearch: (term: string) => void;
  loading: boolean;
  products: Product[];
}

interface MenuInitialData {
  catalog: any[]
  taxes: any[]
  discounts: any[]
  images: Record<string, string>
  modifiers: any[]
}

export interface MenuDashboardProps {
  initialData: MenuInitialData
}