'use client';
import { Checkbox } from '@/components/primitives/ui/checkbox';
import { Label } from '@/components/primitives/ui/label';
import { useCatalog } from '@/shared/hooks/useCatalog';
import { useCartStore } from '@/shared/stores/useCartStore';
import { Box } from '@styled-system/jsx';
import { styled } from '@styled-system/jsx';
import Paragraph from '@/components/primitives/ui/typography/paragraph';

const Flex = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '2',
  },
});

const CheckboxGroup = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3',
  },
});

interface TaxSelectProps {
  itemId: string;
  selectedTaxIds: string[];
  isOrderLevel?: boolean;
}

interface DiscountSelectProps {
  itemId: string;
  selectedDiscountIds: string[];
  isOrderLevel?: boolean;
  orderDiscountIds?: string[];
  disableSelectedOrderLevelDiscounts?: boolean; // NEW
}

export function TaxSelect({ itemId, selectedTaxIds = [], isOrderLevel = false }: TaxSelectProps) {
  const { taxes } = useCatalog();
  const updateItemTaxes = useCartStore((state) => state.updateItemTaxes);
  const updateOrderTaxes = useCartStore((state) => state.updateOrderTaxes);

  const handleTaxChange = (taxId: string, checked: boolean) => {
    let newTaxIds: string[];

    if (checked) {
      // Add tax if not already present
      newTaxIds = selectedTaxIds.includes(taxId) ? selectedTaxIds : [...selectedTaxIds, taxId];
    } else {
      // Remove tax
      newTaxIds = selectedTaxIds.filter((id) => id !== taxId);
    }

    if (isOrderLevel) {
      updateOrderTaxes(newTaxIds);
    } else {
      updateItemTaxes(itemId, newTaxIds);
    }
  };

  return (
    <Box>
      <Paragraph size="compact" textStyle="bold" className="mb-2">
        Applicable Taxes
      </Paragraph>
      <CheckboxGroup>
        {taxes.map((tax) => (
          <Flex key={tax.uid}>
            <Checkbox
              id={`tax-${tax.uid}-${itemId || 'order'}`}
              checked={selectedTaxIds.includes(tax.uid)}
              onCheckedChange={(checked) => handleTaxChange(tax.uid, checked as boolean)}
            />
            <Label htmlFor={`tax-${tax.uid}-${itemId || 'order'}`}>
              {tax.name} ({tax.percentage}%)
            </Label>
          </Flex>
        ))}
      </CheckboxGroup>
    </Box>
  );
}

export function DiscountSelect({
  itemId,
  selectedDiscountIds = [],
  isOrderLevel = false,
  orderDiscountIds = [],
  disableSelectedOrderLevelDiscounts = false, // NEW
}: DiscountSelectProps) {
  const { discounts } = useCatalog();
  const updateItemDiscounts = useCartStore((state) => state.updateItemDiscounts);
  const updateOrderDiscounts = useCartStore((state) => state.updateOrderDiscounts);
  const items = useCartStore((state) => state.items);

  const handleDiscountChange = (discountId: string, checked: boolean) => {
    let newDiscountIds: string[];

    if (checked) {
      // Add discount if not already present
      newDiscountIds = selectedDiscountIds.includes(discountId)
        ? selectedDiscountIds
        : [...selectedDiscountIds, discountId];
    } else {
      // Remove discount
      newDiscountIds = selectedDiscountIds.filter((id) => id !== discountId);

      // Handle order-level discount removal differently based on source
      if (orderDiscountIds.includes(discountId)) {
        if (isOrderLevel) {
          // Unchecking from OrderModifierModal - remove from ALL items and order level
          const newOrderDiscountIds = orderDiscountIds.filter((id) => id !== discountId);
          updateOrderDiscounts(newOrderDiscountIds);

          // Also remove from all items that don't have it at item level
          items.forEach((item) => {
            const currentDiscounts = item.discountIds || [];
            if (currentDiscounts.includes(discountId)) {
              const updatedDiscounts = currentDiscounts.filter((id) => id !== discountId);
              updateItemDiscounts(item.id, updatedDiscounts);
            }
          });
        } else {
          // Unchecking from ItemModal - preserve for other items, remove from order level
          const otherItemsWithDiscount = items.filter(
            (item) => item.id !== itemId && item.discountIds?.includes(discountId)
          );

          if (otherItemsWithDiscount.length > 0) {
            // Other items have this discount at item level, so just remove from order level
            const newOrderDiscountIds = orderDiscountIds.filter((id) => id !== discountId);
            updateOrderDiscounts(newOrderDiscountIds);
          } else {
            // No other items have this discount, so add it to all other items at item level
            // to preserve the discount for them
            items.forEach((item) => {
              if (item.id !== itemId) {
                const currentDiscounts = item.discountIds || [];
                if (!currentDiscounts.includes(discountId)) {
                  updateItemDiscounts(item.id, [...currentDiscounts, discountId]);
                }
              }
            });
            // Then remove from order level
            const newOrderDiscountIds = orderDiscountIds.filter((id) => id !== discountId);
            updateOrderDiscounts(newOrderDiscountIds);
          }
        }
      }
    }

    // Only update the current item/order if we haven't already handled the order-level logic
    if (!orderDiscountIds.includes(discountId) || checked) {
      if (isOrderLevel) {
        updateOrderDiscounts(newDiscountIds);
      } else {
        updateItemDiscounts(itemId, newDiscountIds);
      }
    } else if (!isOrderLevel) {
      // For item-level changes that don't involve order-level discounts, still update the item
      updateItemDiscounts(itemId, newDiscountIds);
    }
  };

  return (
    <Box>
      <Paragraph size="compact" textStyle="bold" className="mb-2">
        Available Discounts
      </Paragraph>
      <CheckboxGroup>
        {discounts.map((discount) => {
          const isOrderLevelApplied = !isOrderLevel && orderDiscountIds.includes(discount.uid);
          const isOrderLevelSelected = selectedDiscountIds.includes(discount.uid);
          return (
            <Flex key={discount.uid}>
              <Checkbox
                id={`discount-${discount.uid}-${itemId || 'order'}`}
                checked={isOrderLevelSelected || isOrderLevelApplied}
                onCheckedChange={(checked) =>
                  handleDiscountChange(discount.uid, checked as boolean)
                }
                disabled={
                  isOrderLevel && disableSelectedOrderLevelDiscounts && isOrderLevelSelected
                }
              />
              <Label htmlFor={`discount-${discount.uid}-${itemId || 'order'}`}>
                {discount.name}
                {discount.percentage ? ` (${discount.percentage}%)` : ''}
              </Label>
            </Flex>
          );
        })}
      </CheckboxGroup>
    </Box>
  );
}
