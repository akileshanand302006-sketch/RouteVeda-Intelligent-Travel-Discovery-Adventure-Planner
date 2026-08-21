export type NotificationType =
  | 'trip'
  | 'wishlist'
  | 'budget'
  | 'recommendation'
  | 'system'
  | 'achievement';

export interface AppNotification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  icon: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}
