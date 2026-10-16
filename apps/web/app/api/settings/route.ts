import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getHospitalSettings, updateHospitalSettings } from '@/lib/settings';

export async function GET() {
  try {
    const settings = getHospitalSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('Settings GET error:', error);
    return NextResponse.json({ error: 'Failed to retrieve settings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = updateHospitalSettings(body);
    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error('Settings POST error:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
