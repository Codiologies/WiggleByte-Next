import { db } from './config';
import { doc, setDoc, getDoc, updateDoc, Timestamp, collection, getDocs, addDoc, query, where, orderBy } from 'firebase/firestore';

export type PlanType = 'free' | 'simple' | 'premium' | 'enterprise';
export type BillingCycle = 'monthly' | 'yearly' | 'trial';

export interface SubscriptionData {
  userId: string;
  planType: PlanType;
  billingCycle: BillingCycle;
  status: 'active' | 'expired' | 'none';
  startDate: Timestamp;
  endDate: Timestamp;
  lastPaymentId?: string;
  downloadEnabled: boolean;
  hasUsedFreeTrial: boolean;
  cancellationReason?: string;
}

export interface PaymentHistory {
  id?: string;
  userId: string;
  planType: string;
  amount: number;
  currency: string;
  billingCycle: string;
  status: 'completed' | 'failed' | 'pending';
  paymentDate: Timestamp;
  invoiceNumber: string;
  paymentMethod: string;
  transactionId: string;
}

export interface InvoiceData extends PaymentHistory {
  companyName: string;
  companyAddress: string;
  customerName: string;
  customerEmail: string;
  customerId: string;
  items: {
    description: string;
    amount: number;
  }[]; 
  subtotal: number;
  tax: number;
  total: number;
}

export const SUBSCRIPTION_PLANS = {
  free: {
    trial: {
      price: 0,
      features: ['Basic Protection', 'Email Support', '1 Device', '7 Days Trial'],
    },
  },
  simple: {
    monthly: {
      price: 9.99,
      features: ['Basic Protection', 'Email Support', '1 Device'],
    },
    yearly: {
      price: 99.99,
      features: ['Basic Protection', 'Email Support', '1 Device', '2 Months Free'],
    },
  },
  premium: {
    monthly: {
      price: 19.99,
      features: ['Advanced Protection', '24/7 Support', '3 Devices', 'Real-time Monitoring'],
    },
    yearly: {
      price: 199.99,
      features: ['Advanced Protection', '24/7 Support', '3 Devices', 'Real-time Monitoring', '2 Months Free'],
    },
  },
  enterprise: {
    monthly: {
      price: 49.99,
      features: ['Enterprise Protection', 'Dedicated Support', 'Unlimited Devices', 'Custom Solutions'],
    },
    yearly: {
      price: 499.99,
      features: ['Enterprise Protection', 'Dedicated Support', 'Unlimited Devices', 'Custom Solutions', '2 Months Free'],
    },
  },
} as const;

export const createSubscription = async (
  userId: string,
  planType: PlanType,
  billingCycle: BillingCycle,
  paymentId: string
): Promise<{ success: boolean; message?: string }> => {
  const now = Timestamp.now();
  const endDate = new Date();
  
  // Set end date based on billing cycle
  if (billingCycle === 'monthly') {
    endDate.setMonth(endDate.getMonth() + 1);
  } else {
    endDate.setFullYear(endDate.getFullYear() + 1);
  }

  // Check current subscription
  const current = await getSubscription(userId);
  const paidPlans: PlanType[] = ['simple', 'premium', 'enterprise'];
  const currentPlanIndex = paidPlans.indexOf(current?.planType || 'free');
  const newPlanIndex = paidPlans.indexOf(planType);

  // If user is on premium, block downgrade to simple or free trial
  if (current && current.status === 'active' && current.planType === 'premium') {
    if (planType === 'simple' || planType === 'free') {
      return { success: false, message: 'Cannot downgrade from premium until it expires.' };
    }
  }

  // If user is on simple, block free trial, but allow upgrade to premium
  if (current && current.status === 'active' && current.planType === 'simple') {
    if (planType === 'free') {
      return { success: false, message: 'Cannot use free trial after purchasing a plan.' };
    }
  }

  // If user is on a paid plan, always set hasUsedFreeTrial to true
  const subscriptionData: SubscriptionData = {
    userId,
    planType,
    billingCycle,
    status: 'active',
    startDate: now,
    endDate: Timestamp.fromDate(endDate),
    lastPaymentId: paymentId,
    downloadEnabled: true,
    hasUsedFreeTrial: current?.hasUsedFreeTrial || false, // Preserve previous value instead of always setting to true
  };

  await setDoc(doc(db, 'subscriptions', userId), subscriptionData);
  return { success: true };
};

export const getSubscription = async (userId: string): Promise<SubscriptionData | null> => {
  const subscriptionRef = doc(db, 'subscriptions', userId);
  const subscriptionDoc = await getDoc(subscriptionRef);
  return subscriptionDoc.exists() ? (subscriptionDoc.data() as SubscriptionData) : null;
};

export const updateSubscriptionStatus = async (
  userId: string,
  status: SubscriptionData['status']
): Promise<void> => {
  const subscriptionRef = doc(db, 'subscriptions', userId);
  await updateDoc(subscriptionRef, {
    status,
    downloadEnabled: status === 'active',
  });
};

export const createFreeTrial = async (userId: string): Promise<{ success: boolean; message?: string }> => {
  const now = Timestamp.now();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 7); // 7 days trial

  // Check current subscription
  const current = await getSubscription(userId);
  const paidPlans: PlanType[] = ['simple', 'premium', 'enterprise'];
  if (current) {
    // If user already used free trial, block
    if (current.hasUsedFreeTrial) {
      return { success: false, message: 'Free trial already used.' };
    }
    
    // If user has an active plan, block
    if (current.status === 'active') {
      return { success: false, message: 'Cannot activate free trial while another plan is active.' };
    }
    
    // We've removed the "ever had a paid plan" check to allow free trial after paid plan expires
  }

  const subscriptionData: SubscriptionData = {
    userId,
    planType: 'free',
    billingCycle: 'trial',
    status: 'active',
    startDate: now,
    endDate: Timestamp.fromDate(endDate),
    downloadEnabled: true,
    hasUsedFreeTrial: true,
  };

  await setDoc(doc(db, 'subscriptions', userId), subscriptionData);
  return { success: true };
};

export const hasUsedFreeTrial = async (userId: string): Promise<boolean> => {
  const subscription = await getSubscription(userId);
  return subscription?.hasUsedFreeTrial || false;
};

export const checkSubscriptionStatus = async (userId: string): Promise<boolean> => {
  const subscription = await getSubscription(userId);
  if (!subscription) return false;

  const now = Timestamp.now();
  if (subscription.endDate.toDate() < now.toDate()) {
    await updateSubscriptionStatus(userId, 'expired');
    return false;
  }

  // For free trial, check if it's still within the trial period
  if (subscription.planType === 'free' && subscription.billingCycle === 'trial') {
    return subscription.status === 'active' && subscription.downloadEnabled;
  }

  return subscription.status === 'active' && subscription.downloadEnabled;
  
};

// Helper to determine which buttons to enable/disable
export const getSubscriptionButtonStates = (subscription: SubscriptionData | null) => {
  const now = new Date();
  let freeTrialDisabled = false;
  let simpleDisabled = false;
  let premiumDisabled = false;

  if (!subscription) {
    // New user: all enabled
    return { freeTrialDisabled: false, simpleDisabled: false, premiumDisabled: false };
  }

  // Only disable free trial if user has used it before
  if (subscription.hasUsedFreeTrial) {
    freeTrialDisabled = true;
  }

  // If user is on premium and it's active, disable free trial and simple, and premium itself
  if (subscription.planType === 'premium' && subscription.status === 'active' && subscription.endDate.toDate() > now) {
    freeTrialDisabled = true;
    simpleDisabled = true;
    premiumDisabled = true; // Disable premium button itself
  }

  // If user is on simple and it's active, disable free trial and simple itself
  if (subscription.planType === 'simple' && subscription.status === 'active' && subscription.endDate.toDate() > now) {
    freeTrialDisabled = true;
    simpleDisabled = true; // Disable simple button itself
  }

  return { freeTrialDisabled, simpleDisabled, premiumDisabled };
};

// Function to store payment history
export const storePaymentHistory = async (paymentData: Omit<PaymentHistory, 'id' | 'paymentDate' | 'invoiceNumber'>) => {
  try {
    const invoiceNumber = generateInvoiceNumber();
    const paymentHistory: PaymentHistory = {
      ...paymentData,
      paymentDate: Timestamp.now(),
      invoiceNumber,
      status: 'completed'
    };

    // Store payment in user's paymentHistory subcollection
    const userPaymentHistoryRef = collection(db, 'users', paymentData.userId, 'paymentHistory');
    const docRef = await addDoc(userPaymentHistoryRef, paymentHistory);
    return { ...paymentHistory, id: docRef.id };
  } catch (error) {
    console.error('Error storing payment history:', error);
    throw error;
  }
};

// Function to get user's payment history
export const getUserPaymentHistory = async (userId: string) => {
  try {
    // Query the user's paymentHistory subcollection
    const userPaymentHistoryRef = collection(db, 'users', userId, 'paymentHistory');
    const q = query(
      userPaymentHistoryRef,
      orderBy('paymentDate', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as PaymentHistory[];
  } catch (error) {
    console.error('Error fetching payment history:', error);
    throw error;
  }
};

// Function to generate invoice data
export const generateInvoiceData = async (userId: string, paymentId: string): Promise<InvoiceData> => {
  try {
    // Get payment from user's paymentHistory subcollection
    const paymentDoc = await getDoc(doc(db, 'users', userId, 'paymentHistory', paymentId));
    if (!paymentDoc.exists()) {
      throw new Error('Payment record not found');
    }

    const payment = paymentDoc.data() as PaymentHistory;
    const userDoc = await getDoc(doc(db, 'users', userId));
    const userData = userDoc.data();

    // Get user's full name from userData
    let customerName = userData?.name;
    if (!customerName) {
      // If no name is set, try to get it from the email
      const emailParts = userData?.email?.split('@')[0].split('.');
      if (emailParts) {
        // Convert email username to proper name format (e.g., "john.doe" -> "John Doe")
        customerName = emailParts
          .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' ');
      }
    }
    // If still no name, use a generic fallback
    customerName = customerName || 'Valued Customer';

    // Calculate tax (example: 10%)
    const subtotal = payment.amount;
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    const invoiceData: InvoiceData = {
      ...payment,
      companyName: 'WiggleByte Security',
      companyAddress: '123 Security Street, Cyber City, 12345',
      customerName: customerName,
      customerEmail: userData?.email || '',
      customerId: userId,
      items: [{
        description: `${payment.planType.toUpperCase()} Plan - ${payment.billingCycle} Billing`,
        amount: payment.amount
      }],
      subtotal,
      tax,
      total
    };

    return invoiceData;
  } catch (error) {
    console.error('Error generating invoice data:', error);
    throw error;
  }
};

// Helper function to generate invoice number
const generateInvoiceNumber = () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `INV-${year}${month}-${random}`;
};

// Update the existing handleSubscribe function to store payment history
export const handleSubscribe = async (
  userId: string,
  planType: string,
  billingCycle: string,
  amount: number,
  currency: string,
  paymentMethod: string,
  transactionId: string
) => {
  try {
    // Store payment history
    await storePaymentHistory({
      userId,
      planType,
      amount,
      currency,
      billingCycle,
      paymentMethod,
      transactionId,
      status: 'completed'
    });

    // Update subscription status
    // ... existing subscription update code ...

  } catch (error) {
    console.error('Error in subscription process:', error);
    throw error;
  }
}; 