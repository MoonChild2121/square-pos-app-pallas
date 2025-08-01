'use client';

import { memo } from 'react';
import { Grid } from '@styled-system/jsx';
import { css } from '@styled-system/css';
import ProductCard from '@/components/composites/product/ProductCard';
import { ProductGridProps } from './types';
import Heading from '@/components/primitives/ui/typography/heading';

const ProductGrid = memo(function ProductGrid({ products, loading }: ProductGridProps) {
  if (loading) {
    return (
      <Heading level={5} color="disabled">
        Searching...
      </Heading>
    );
  }

  return (
    <Grid
      className={css({
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: 'layout.internal.sm',
        py: 'padding.block.md',
        w: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
      })}
    >
      {(Array.isArray(products) ? products : []).map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          price={product.price}
          imageUrl={product.imageUrl}
          taxIds={product.taxIds}
          modifiers={product.modifiers}
        />
      ))}
    </Grid>
  );
});

export default ProductGrid;
