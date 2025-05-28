import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

// Add logging to check environment variables
console.log('RAZORPAY_KEY_ID exists:', !!process.env.RAZORPAY_KEY_ID);
console.log('RAZORPAY_KEY_SECRET exists:', !!process.env.RAZORPAY_KEY_SECRET);

// Initialize Razorpay with your credentials
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: Request) {
  try {
    const { amount, currency = 'INR', planType, billingCycle } = await request.json();
    
    // Log the incoming request data
    console.log('Payment request:', { amount, currency, planType, billingCycle });

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount * 100, // Razorpay expects amount in smallest currency unit (paise for INR)
      currency,
      receipt: `receipt_${Date.now()}`,
      notes: {
        planType,
        billingCycle,
      },
    });

    // Log successful order creation
    console.log('Order created successfully:', order.id);

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
    });
    
    return NextResponse.json(
      { error: 'Failed to create payment', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 