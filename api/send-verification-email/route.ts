import { Platform } from 'react-native';
import MailComposer from 'react-native-mail-composer';
import { EmailParams } from './types';

const ADMIN_EMAIL: string = 'your-admin-email@example.com';

export const sendEmail = async ({
  to,
  userType,
  salonName,
  phoneNumber,
  orderNumber,
  isDeliveryNotification,
  isApprovalNotification,
  approved
}: EmailParams): Promise<{ success: boolean }> => {
  try {
    if (isApprovalNotification) {
      const emailContent: string = approved 
        ? `
          Dear ${userType === 'salon' ? 'Salon Owner' : 'Wholesale Partner'},

          Great news! Your account has been approved. You can now start placing orders on Glam Glide.

          Thank you for choosing Glam Glide!

          Best regards,
          The Glam Glide Team
        `
        : `
          Dear ${userType === 'salon' ? 'Salon Owner' : 'Wholesale Partner'},

          We regret to inform you that your account registration could not be approved at this time.

          If you believe this is an error, please contact our support team.

          Best regards,
          The Glam Glide Team
        `;

      await MailComposer.composeAsync({
        recipients: [to],
        subject: `Glam Glide Account ${approved ? 'Approved' : 'Not Approved'}`,
        body: emailContent
      });

      return { success: true };
    }

    if (isDeliveryNotification && orderNumber) {
      const deliveryEmailContent: string = `
        Dear Customer,

        Great news! Your order #${orderNumber} has been delivered.

        If you haven't received your order or have any questions, please don't hesitate to contact us.

        Thank you for shopping with Glam Glide!

        Best regards,
        The Glam Glide Team
      `;

      await MailComposer.composeAsync({
        recipients: [to],
        subject: `Your Glam Glide Order #${orderNumber} has been Delivered!`,
        body: deliveryEmailContent
      });

      return { success: true };
    }

    const userEmailContent: string = userType === 'salon'
      ? `
        Thank you for registering your salon "${salonName}" with Glam Glide!
        
        To complete your registration, please:
        1. Reply to this email with your GST number (optional)
        2. Attach at least 2 clear images of your salon
        
        Our team will review your information and activate your account within 24-48 hours.
        
        Best regards,
        The Glam Glide Team
      `
      : `
        Thank you for registering as a wholesale dealer with Glam Glide!
        
        To complete your registration, please:
        1. Reply to this email with your GST number (required)
        2. Attach at least 2 clear images of your shop/warehouse
        
        Our team will review your information and activate your account within 24-48 hours.
        
        Best regards,
        The Glam Glide Team
      `;

    await MailComposer.composeAsync({
      recipients: [to],
      subject: `Complete Your ${userType === 'salon' ? 'Salon' : 'Wholesale Dealer'} Registration`,
      body: userEmailContent
    });

    await MailComposer.composeAsync({
      recipients: [ADMIN_EMAIL],
      subject: `New ${userType === 'salon' ? 'Salon' : 'Wholesale Dealer'} Registration`,
      body: `
        New registration details:
        Type: ${userType}
        ${userType === 'salon' ? 'Salon Name' : 'Business Name'}: ${salonName}
        Email: ${to}
        Phone: ${phoneNumber}
        
        Waiting for their reply with GST and images.
      `
    });

    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Failed to send email');
  }
};