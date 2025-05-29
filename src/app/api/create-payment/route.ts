import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

// Add detailed logging to check environment variables
console.log('Environment check:', {
  NODE_ENV: process.env.NODE_ENV,
  RAZORPAY_KEY_ID_LENGTH: process.env.RAZORPAY_KEY_ID?.length || 0,
  RAZORPAY_KEY_SECRET_LENGTH: process.env.RAZORPAY_KEY_SECRET?.length || 0,
  NEXT_PUBLIC_RAZORPAY_KEY_ID_LENGTH: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.length || 0,
  // Log first few characters of keys (safely)
  RAZORPAY_KEY_ID_PREFIX: process.env.RAZORPAY_KEY_ID?.substring(0, 4) || 'not set',
  NEXT_PUBLIC_RAZORPAY_KEY_ID_PREFIX: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.substring(0, 4) || 'not set'
});

// Validate environment variables
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error('Missing Razorpay environment variables');
  throw new Error('Razorpay configuration is incomplete');
}

// Initialize Razorpay with your credentials
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request: Request) {
  try {
    const { amount, currency = 'INR', planType, billingCycle } = await request.json();
    
    // Log the incoming request data
    console.log('Payment request:', { 
      amount, 
      currency, 
      planType, 
      billingCycle,
      amountInPaise: amount * 100,
      environment: process.env.NODE_ENV
    });

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount * 100, // Razorpay expects amount in smallest currency unit (paise for INR)
      currency,
      receipt: `receipt_${Date.now()}`,
      notes: {
        planType,
        billingCycle,
        environment: process.env.NODE_ENV
      },
    });

    // Log successful order creation
    console.log('Order created successfully:', {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      environment: process.env.NODE_ENV
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    // Enhanced error logging
    console.error('Error creating Razorpay order:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      environment: process.env.NODE_ENV,
      hasKeyId: !!process.env.RAZORPAY_KEY_ID,
      hasKeySecret: !!process.env.RAZORPAY_KEY_SECRET
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to create payment', 
        details: error instanceof Error ? error.message : 'Unknown error',
        environment: process.env.NODE_ENV
      },
      { status: 500 }
    );
  }
} 