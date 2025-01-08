export interface EmailParams {
    to: string;
    userType: 'salon' | 'wholesale';
    salonName: string;
    phoneNumber: string;
    orderNumber?: string;
    isDeliveryNotification?: boolean;
    isApprovalNotification?: boolean;
    approved?: boolean;
  }
  