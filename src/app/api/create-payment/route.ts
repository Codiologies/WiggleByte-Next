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

// Helper function to create response with CORS headers
const createResponse = (data: any, status = 200) => {
  return NextResponse.json(data, {
    status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Content-Type': 'application/json',
    },
  });
};

export async function OPTIONS() {
  return createResponse({});
}

export async function POST(request: Request) {
  try {
    // Validate request method
    if (request.method !== 'POST') {
      return createResponse(
        { error: 'Method not allowed' },
        405
      );
    }

    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch (e) {
      console.error('Failed to parse request body:', e);
      return createResponse(
        { error: 'Invalid request body' },
        400
      );
    }

    const { amount, currency = 'INR', planType, billingCycle } = body;

    // Validate required fields
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return createResponse(
        { error: 'Invalid amount' },
        400
      );
    }

    if (!planType || !billingCycle) {
      return createResponse(
        { error: 'Missing plan details' },
        400
      );
    }

    // Log the incoming request data
    console.log('Payment request:', { 
      amount, 
      currency, 
      planType, 
      billingCycle,
      amountInPaise: amount * 100,
      environment: process.env.NODE_ENV
    });

    try {
      // Create Razorpay order
      const order = await razorpay.orders.create({
        amount: Math.round(amount * 100), // Razorpay expects amount in smallest currency unit (paise for INR)
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

      return createResponse({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
      });
    } catch (razorpayError: any) {
      // Handle specific Razorpay errors
      console.error('Razorpay API error:', {
        error: razorpayError.message,
        code: razorpayError.code,
        statusCode: razorpayError.statusCode
      });

      // Map Razorpay error codes to user-friendly messages
      const errorMessages: { [key: string]: string } = {
        'BAD_REQUEST_ERROR': 'Invalid payment request',
        'GATEWAY_ERROR': 'Payment gateway error',
        'SERVER_ERROR': 'Payment server error',
        'UNAUTHORIZED': 'Invalid payment credentials'
      };

      const errorMessage = errorMessages[razorpayError.code] || 'Failed to create payment';
      
      return createResponse(
        { 
          error: errorMessage,
          details: razorpayError.message
        },
        razorpayError.statusCode || 500
      );
    }
  } catch (error) {
    // Enhanced error logging
    console.error('Error creating Razorpay order:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      environment: process.env.NODE_ENV,
      hasKeyId: !!process.env.RAZORPAY_KEY_ID,
      hasKeySecret: !!process.env.RAZORPAY_KEY_SECRET
    });
    
    return createResponse(
      { 
        error: 'Failed to create payment',
        details: error instanceof Error ? error.message : 'Unknown error',
        environment: process.env.NODE_ENV
      },
      500
    );
  }
} 