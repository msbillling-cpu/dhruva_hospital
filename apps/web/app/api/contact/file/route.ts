import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import { getExcelFilePath } from '@/lib/excel';

export async function GET(req: NextRequest) {
  const password = req.nextUrl.searchParams.get('password');

  if (password !== 'mahe@123') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const filePath = getExcelFilePath();

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);

  return new NextResponse(new Uint8Array(fileBuffer), {
    headers: {
      'Content-Disposition': 'attachment; filename="appointments.xlsx"',
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
  });
}
