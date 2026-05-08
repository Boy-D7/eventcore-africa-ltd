export interface PaymentRequest {
  phoneNumber: string;
  amount: number;
  reference: string; // The Ticket ID
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  message: string;
}
