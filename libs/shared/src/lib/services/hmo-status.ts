import { OrderStatus } from '@healbridge/api';

export function isPaid(status?: string): boolean {
  return (
    status === OrderStatus.PaymentCompleted ||
    status === OrderStatus.Processed ||
    status === OrderStatus.Accepted
  );
}

export function statusLabel(status?: string): string {
  if (isPaid(status)) return 'Active';
  switch (status) {
    case OrderStatus.PaymentInitiated:
    case OrderStatus.PaymentProcessing:
    case OrderStatus.Pending:
      return 'Payment pending';
    case OrderStatus.PaymentFailed:
      return 'Payment failed';
    case OrderStatus.Cancelled:
      return 'Cancelled';
    default:
      return status ?? '';
  }
}

export function statusColor(status?: string): string {
  if (isPaid(status)) return '#317E3D';
  switch (status) {
    case OrderStatus.PaymentInitiated:
    case OrderStatus.PaymentProcessing:
    case OrderStatus.Pending:
      return '#C77700';
    case OrderStatus.PaymentFailed:
      return '#DC3545';
    default:
      return '#6F786F';
  }
}
