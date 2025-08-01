export interface OrderConfirmationViewProps {
  state: any;
  catalogLoading: boolean;
  getVariantImageUrl: (catalogObjectId: string) => string | undefined;
  onContinueShopping: () => void;
}
