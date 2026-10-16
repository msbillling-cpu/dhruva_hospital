import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { 
  createAppointment, 
  getAllAppointments, 
  updateAppointmentStatus, 
  deleteAppointment 
} from '@/lib/appointments';
import { saveToExcel } from '@/lib/excel';

export async function GET() {
  try {
    const appointments = getAllAppointments();
    
    // Compute quick aggregates for dashboard
    const stats = {
      total: appointments.length,
      pending: appointments.filter(a => a.status === 'pending').length,
      contacted: appointments.filter(a => a.status === 'contacted').length,
      confirmed: appointments.filter(a => a.status === 'confirmed').length,
      completed: appointments.filter(a => a.status === 'completed').length,
      cancelled: appointments.filter(a => a.status === 'cancelled').length,
      byService: appointments.reduce((acc, a) => {
        const s = a.service || 'general';
        acc[s] = (acc[s] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };

    return NextResponse.json({ success: true, appointments, stats });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, service, doctor, date } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and Phone number are required.' }, { status: 400 });
    }
    
    // Server-side validation
    if (/[0-9]/.test(name) && name.length < 3) {
      return NextResponse.json({ error: 'Name should not contain numbers.' }, { status: 400 });
    }
    if (!/^[6-9]\d{9}$/.test(phone.replace(/\D/g, ''))) {
      return NextResponse.json({ error: 'Invalid Indian phone number.' }, { status: 400 });
    }

    const cleanPhone = phone.replace(/\D/g, '');

    const appointment = createAppointment({
      name: name.trim(),
      phone: cleanPhone,
      email: body.email?.trim() || '',
      service: service || 'General Consultation',
      doctor: doctor || 'Any Available Specialist',
      date: date || new Date().toISOString().split('T')[0],
      message: body.message?.trim() || '',
      location: body.location?.trim() || 'Kadapa',
    });

    // Also persist to Excel asynchronously
    saveToExcel({
      Name: appointment.name,
      Phone: appointment.phone,
      Email: appointment.email || 'N/A',
      Service: appointment.service,
      Doctor: appointment.doctor,
      Date: appointment.date,
      Message: appointment.message || 'N/A',
    }).catch(err => console.error('Error saving to Excel:', err));

    return NextResponse.json({ success: true, appointment }, { status: 201 });
  } catch (err) {
    console.error('Appointment POST error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, notes } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Appointment ID and status are required.' }, { status: 400 });
    }

    const updated = updateAppointmentStatus(id, status, notes);
    if (!updated) {
      return NextResponse.json({ error: 'Appointment not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, appointment: updated });
  } catch (err) {
    console.error('Appointment PATCH error:', err);
    return NextResponse.json({ error: 'Failed to update appointment.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Appointment ID is required.' }, { status: 400 });
    }

    const deleted = deleteAppointment(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Appointment not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Appointment deleted successfully.' });
  } catch (err) {
    console.error('Appointment DELETE error:', err);
    return NextResponse.json({ error: 'Failed to delete appointment.' }, { status: 500 });
  }
}
