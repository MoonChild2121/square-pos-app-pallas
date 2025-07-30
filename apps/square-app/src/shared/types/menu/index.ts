import type { ReactNode } from 'react';
import { Product } from '@/shared/types/base';
import { CatalogData } from '@/shared/services/catalog/interface';

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

export interface HomeLayoutProps {
  menuItems: MenuItem[];
  selectedItem: string;
  onSelectItem: (id: string) => void;
  onSearch: (term: string) => void;
  loading: boolean;
  products: Product[];
}

export interface HomeContainerProps {
  initialData: CatalogData
}