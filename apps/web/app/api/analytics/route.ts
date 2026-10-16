import { NextResponse } from 'next/server';
import { getHospitalAnalytics } from '@/lib/analytics';

export async function GET() {
  try {
    const analytics = getHospitalAnalytics();
    return NextResponse.json({ success: true, data: analytics });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
