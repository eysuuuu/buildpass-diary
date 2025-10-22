import connectDB from '@/lib/mongodb';
import SiteDiaryModel from '@/models/SiteDiary';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;

    await connectDB();

    const entry = await SiteDiaryModel.findOne({ id }).lean();

    if (!entry) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    // Convert MongoDB document to response format
    const response = {
      id: entry.id,
      date: entry.date,
      title: entry.title,
      createdBy: entry.createdBy,
      content: entry.content,
      weather: entry.weather,
      attendees: entry.attendees,
      attachments: entry.attachments,
    };

    return NextResponse.json(response, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching site diary:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
