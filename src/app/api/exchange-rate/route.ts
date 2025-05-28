import { NextResponse } from 'next/server';

export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

// Cache the exchange rate for 1 hour to avoid too many API calls
let cachedRate: { rate: number; timestamp: number } | null = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

export async function GET() {
  try {
    // Check if we have a cached rate that's still valid
    if (cachedRate && Date.now() - cachedRate.timestamp < CACHE_DURATION) {
      return NextResponse.json({ rate: cachedRate.rate });
    }

    // Fetch from ExchangeRate-API
    const response = await fetch(
      'https://open.er-api.com/v6/latest/USD',
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!response.ok) {
      throw new Error('Failed to fetch exchange rate');
    }

    const data = await response.json();
    const rate = data.rates.INR;

    // Update cache
    cachedRate = {
      rate,
      timestamp: Date.now()
    };

    return NextResponse.json({ rate });
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    // Fallback to a default rate if API fails
    return NextResponse.json({ rate: 85.60 });
  }
} 