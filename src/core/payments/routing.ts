import { processAirtelPayment } from './providers/airtel';
import { processTNMPayment } from './providers/tnm';

export async function routePayment(phoneNumber: string, amount: number, eventId: string) {
  // Detect provider: TNM starts with 088 / Airtel starts with 099
  const isTNM = phoneNumber.startsWith('088') || phoneNumber.startsWith('88');
  
  const payload = {
    phoneNumber,
    amount,
    reference: `EVT-${eventId}-${Date.now()}` // Unique ID for Council audits
  };

  if (isTNM) {
    return await processTNMPayment(payload);
  } else {
    return await processAirtelPayment(payload);
  }
}
